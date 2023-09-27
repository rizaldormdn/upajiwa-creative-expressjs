import { Request, Response, Router } from "express";
import Middleware from "../../../Middleware";
import Status from "../../../Status";
import Image from "../../../images/domain/entity/Image";
import ImageRepository from "../../../images/infrastructure/database/ImageRepository";
import Specification from "../../../specification";
import Art from "../../domain/entity/Art";
import { ArtSnapshots } from "../../domain/entity/ArtSnapshot";
import Slug from "../../domain/valueobject/Slug";
import ArtRepository from "../../infrastructure/database/ArtRepository";
import ArtMapper, { ArtsMapper } from "./ArtMapper";
import Dimension from "../../domain/valueobject/Dimension";
import Style, { Styles } from "../../domain/valueobject/Style";

export default class ArtHandler {
  public static router(
    artRepository: ArtRepository,
    imageRepository: ImageRepository
  ): Router {
    const router: Router = Router();

    router.get("/art-list", async (req: Request, res: Response) => {
      try {
        let page = Number(req.query.page ?? 1);
        let limit = Number(process.env.LIMIT_ART);
        let specification: Specification = new Specification(
          String(req.query.search ?? ""),
          page
        );
        let total: number = await artRepository.countArt(specification);
        let artSnapshot: ArtSnapshots = await artRepository.getArts(
          specification
        );
        if (!artSnapshot) {
          return res
            .status(404)
            .json({
              status: Status.Error,
              message: "art not found",
            })
            .end();
        }
        return res
          .status(200)
          .json({
            status: Status.Success,
            data: ArtsMapper.toJSON(artSnapshot),
            paging: {
              page: page,
              pages: Math.ceil(total / limit),
              limit: limit,
              total: total,
            },
          })
          .end();
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({
            status: Status.Error,
          })
          .end();
      }
    });

    router.get("/art/:slug", async (req: Request, res: Response) => {
      try {
        let slug: Slug = new Slug().rebuild(req.params.slug);
        let art: Art | undefined = await artRepository.getArt(slug);

        if (!art) {
          return res
            .status(404)
            .json({
              status: Status.Fail,
              message: "art Work not found",
            })
            .end();
        }
        return res
          .status(200)
          .json({
            status: Status.Success,
            data: ArtMapper.toJSON(art),
          })
          .end();
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({
            status: Status.Error,
          })
          .end();
      }
    });

    router.get("/series-art", async (req: Request, res: Response) => {
      try {
        let series = String(req.query.series);
        let page = Number(req.query.page);
        let limit = Number(process.env.LIMIT_ART);
        let specification: Specification = new Specification(
          String(req.query.search ?? ""),
          page
        );
        let total: number = await artRepository.countArtBySeries(
          specification,
          series
        );

        let artSnapshot: ArtSnapshots = await artRepository.getArtBySeries(
          specification,
          series
        );
        return res
          .status(200)
          .json({
            status: Status.Success,
            data: ArtsMapper.toJSON(artSnapshot),
            paging: {
              page: page,
              pages: Math.ceil(total / limit),
              limit: limit,
              total: total,
            },
          })
          .end();
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({
            status: Status.Error,
          })
          .end();
      }
    });

    router.get("/featured-art", async (_: Request, res: Response) => {
      try {
        let newArt: ArtSnapshots = await artRepository.getNewArt();
        return res
          .status(200)
          .json({
            status: Status.Success,
            data: ArtsMapper.toJSON(newArt),
          })
          .end();
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({
            status: Status.Error,
          })
          .end();
      }
    });

    router.post(
      "/art",
      Middleware.authentication,
      async (req: Request, res: Response) => {
        try {
          let image: Image | undefined = await imageRepository.getImage(
            req.body.image_id
          );
          if (!image) {
            return res
              .status(404)
              .json({
                status: Status.Fail,
                message: "image not found",
              })
              .end();
          }
          let title = req.body.title;
          let slug: Slug = new Slug(title);
          let description = req.body.description;
          let series = req.body.series;
          let medium = req.body.medium;
          let material = req.body.material;
          let dimension: Dimension = new Dimension(
            req.body.height,
            req.body.width
          );
          let styles: Styles = [];
          for (let style of req.body.styles) {
            styles.push(new Style(style));
          }

          let art: Art = new Art(
            slug,
            title,
            description,
            series,
            medium,
            material,
            image,
            dimension,
            styles
          );
          await artRepository.saveArt(art);
          return res.status(200).json({
            status: Status.Success,
            data: ArtMapper.toJSON(art),
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            status: Status.Error,
          });
        }
      }
    );

    router.put(
      "/art",
      Middleware.authentication,
      async (req: Request, res: Response) => {
        try {
          let image: Image | undefined = await imageRepository.getImage(
            req.body.image_id
          );
          if (!image) {
            return res
              .status(404)
              .json({
                status: Status.Fail,
                message: "image not found",
              })
              .end();
          }
          let slug: Slug = new Slug().rebuild(req.params.slug);
          let title = req.body.title;
          let description = req.body.description;
          let series = req.body.series;
          let medium = req.body.medium;
          let material = req.body.material;
          let dimension: Dimension = new Dimension(
            req.body.height,
            req.body.width
          );
          let styles: Styles = [];
          for (let style of req.body.styles) {
            styles.push(new Style(style));
          }

          let art: Art = new Art(
            slug,
            title,
            description,
            series,
            medium,
            material,
            image,
            dimension,
            styles
          );

          await artRepository.updateArt(art);
          return res
            .status(200)
            .json({
              status: Status.Success,
            })
            .end();
        } catch (error) {
          console.error(error);
          return res
            .status(500)
            .json({
              status: Status.Error,
            })
            .end();
        }
      }
    );

    router.delete(
      "/art",
      Middleware.authentication,
      async (req: Request, res: Response) => {
        try {
          let slug: Slug = new Slug().rebuild(req.params.slug);
          await artRepository.deleteArt(slug);

          return res
            .status(200)
            .json({
              status: Status.Success,
            })
            .end();
        } catch (error) {
          console.error(error);
          return res
            .status(500)
            .json({
              status: Status.Error,
            })
            .end();
        }
      }
    );

    return router;
  }
}
