import { Request, Response, Router } from "express";
import ImageRepository from "../../infrastructure/database/ImageRepository";
import multer, { FileFilterCallback } from "multer";
import crypto from "crypto";
import sanitize from "sanitize-filename";
import Middleware from "../../../Middleware";
import Status from "../../../Status";
import Image, { Images } from "../../domain/entity/Image";
import ImageUrl from "../../domain/valuobject/ImageUrl";
import ImageMapper, { ImagesMapper } from "./ImageMapper";
import Specification from "../../../specification";

export default class ImageHandler {
  public static router(imageRepository: ImageRepository): Router {
    const router: Router = Router();

    const storage = multer.diskStorage({
      destination: (_, file, cb) => {
        if (file.fieldname === "original") {
          cb(null, "public/images");
        }
      },
      filename: (_, file, cb) => {
        cb(
          null,
          crypto.randomBytes(6).toString("hex") +
            "_" +
            sanitize(file.originalname)
        );
      },
    });
    const fileFilter = (
      _: Request,
      file: Express.Multer.File,
      cb: FileFilterCallback
    ) => {
      if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg") {
        cb(new Error("image type is not allowed"));
      }
      cb(null, true);
    };
    const upload = multer({
      storage: storage,
      limits: { fileSize: 2048000 },
      fileFilter: fileFilter,
    }).fields([{ name: "original" }]);

    router.post(
      "/image",
      Middleware.authentication,
      async (req: Request, res: Response) => {
        upload(req, res, async (err: any) => {
          if (err) {
            console.error(err);
            res
              .status(500)
              .json({
                status: Status.Error,
                message: "failed to create an image",
              })
              .end();
          }

          let files = req.files as {
            [fieldname: string]: Express.Multer.File[];
          };
          let image: Image = new Image(
            new ImageUrl(
              process.env.BASE_URL +
                "/static/images/" +
                files["original"][0].filename
            ),
            req.body.alt
          );
          await imageRepository.saveImage(image);
          res
            .status(200)
            .json({ status: Status.Success, data: ImageMapper.toJSON(image) });
        });
      }
    );

    router.get("/image/:id", async (req: Request, res: Response) => {
      try {
        let image: Image | undefined = await imageRepository.getImage(
          req.params.id
        );
        if (!image) {
          res
            .status(404)
            .json({
              status: Status.Fail,
              message: "image not found",
            })
            .end();

          return;
        }
        res
          .status(200)
          .json({
            status: Status.Success,
            data: ImageMapper.toJSON(image),
          })
          .end();
      } catch (error) {
        console.error(error);

        res
          .status(500)
          .json({
            status: Status.Error,
            message: "failed to get an image",
          })
          .end();
      }
    });
    router.get("/images", async (req: Request, res: Response) => {
      try {
        let page = Number(req.query.page ?? 1);
        let limit = Number(process.env.LIMIT_IMAGES);
        let specification: Specification = new Specification(
          String(req.query.search ?? ""),
          page
        );

        const images: Images = await imageRepository.getImages(specification);
        const total: number = await imageRepository.countImages(specification);

        return res
          .status(200)
          .json({
            status: Status.Success,
            data: {
              images: ImagesMapper.toJSON(images),
              paging: {
                page: page,
                pages: Math.ceil(total / limit),
                limit: limit,
                total: total,
              },
            },
          })
          .end();
      } catch (error) {
        return res
          .status(500)
          .json({
            status: Status.Error,
            message: "failed to get an images",
          })
          .end();
      }
    });
    return router;
  }
}
