require("dotenv").config();

import { Request, Response, Router } from "express";
import multer, { FileFilterCallback } from "multer";
import Middleware from "../Middleware";
import Status from "../Status";
import ImageModels from "./ImageModels";
import crypto from "crypto";
import sanitize from "sanitize-filename";

export default class ImageController {
  public static router(): Router {
    const router: Router = Router();

    const storage = multer.diskStorage({
      destination: (_, file, cb) => {
        cb(null, "public/images/");
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
      if (
        file.mimetype !== "image/png" &&
        file.mimetype !== "image/jpeg" &&
        file.mimetype !== "image/jpg"
      ) {
        cb(new Error("image type is not allowed"));
      }
      cb(null, true);
    };

    const upload = multer({
      storage: storage,
      limits: { fileSize: 20048000 },
      fileFilter: fileFilter,
    }).fields([{ name: "url" }]);

    router.get("/image", async (req: Request, res: Response) => {
      try {
        const images = await ImageModels.find();
        if (!images) {
          return res.status(500).json({
            status: Status.Fail,
            message: "image tidak ditemukan",
          });
        }
        return res.status(200).json({
          status: Status.Success,
          images,
        });
      } catch (error) {
        return res.status(500).json({
          status: Status.Error,
        });
      }
    });
    router.get("/image/:id", async (req: Request, res: Response) => {
      try {
        const image = await ImageModels.find({ id: req.params._id });
        if (!image) {
          return res.status(500).json({
            message: "image tidak ditemukan",
          });
        }
        return res.status(200).json({
          message: "success",
          image,
        });
      } catch (error) {
        res.status(500).json({
          status: Status.Error,
        });
      }
    });
    router.post(
      "/image",
      Middleware.authentication,
      async (req: Request, res: Response) => {
        upload(req, res, async (err: any) => {
          if (err) {
            console.log(err);

            res.status(500).json({
              status: Status.Error,
              message: "failed to create an image",
            });
          }
          try {
            const files = req.files as {
              [fieldName: string]: Express.Multer.File[];
            };
            const images = new ImageModels({
              url:
                process.env.BASE_URL +
                "/static/images/" +
                files["url"][0].filename,
              alt: req.body.alt,
            });
            const data = await images.save();

            return res.status(200).json({
              status: Status.Success,
              data: {
                data,
              },
            });
          } catch (error) {
            console.log(error);
            return res.status(500).json({
              status: Status.Error,
            });
          }
        });
      }
    );
    return router;
  }
}
