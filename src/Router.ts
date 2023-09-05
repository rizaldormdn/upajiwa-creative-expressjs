import { Router as ExpressRouter } from "express";
import ImageController from "./images/ImagesController";
import ProductControllers from "./product/ProductController";
import UserController from "./user/UserController";

export default class Router {
  public static run(): ExpressRouter {
    const router: ExpressRouter = ExpressRouter();

    router.use("/v1/auth", UserController.router());
    router.use("/v1", ProductControllers.router());
    router.use("/v1", ImageController.router());

    return router;
  }
}
