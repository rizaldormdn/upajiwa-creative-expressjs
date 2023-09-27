import { Request, Response, Router } from "express";
import MerchandiseRepository from "../../infrastructure/database/MerchandiseRepository";
import Middleware from "../../../Middleware";
import Image from "../../../images/domain/entity/Image";
import ImageRepository from "../../../images/infrastructure/database/ImageRepository";
import Status from "../../../Status";
import Merchandise from "../../domain/entity/Merchandise";
import Slug from "../../domain/valueobject/Slug";
import MerchandiseMapper from "./MerchandiseMapper";

export default class MerchandiseHandler {
  public static router(
    merchandiseRepository: MerchandiseRepository,
    imageRepository: ImageRepository
  ): Router {
    const router: Router = Router();

    router.post(
      "/merchandise",
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
          let description = req.body.description;
          let slug: Slug = new Slug(title);
          let merch: Merchandise = new Merchandise(
            slug,
            title,
            description,
            image
          );
          await merchandiseRepository.saveMerchandise(merch);
          return res.status(200).json({
            status: Status.Success,
            data: MerchandiseMapper.toJSON(merch),
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            status: Status.Error,
          });
        }
      }
    );

    router.get("/merchandise/:slug", async (req: Request, res: Response) => {
      try {
        let slug: Slug = new Slug().rebuild(req.params.slug);
        let merch: Merchandise | undefined =
          await merchandiseRepository.getMerchandise(slug);
        if (!merch) {
          return res
            .status(404)
            .json({
              status: Status.Fail,
              message: "merchandise not found",
            })
            .end();
        }
        return res
          .status(200)
          .json({
            status: Status.Success,
            data: MerchandiseMapper.toJSON(merch),
          })
          .end();
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          status: Status.Error,
        });
      }
    });
    return router;
  }
}
