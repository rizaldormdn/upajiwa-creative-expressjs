import { Router as ExpressRouter } from "express";
import UserRepository from "./user/infrastructure/database/UserRepository";
import UserHandler from "./user/presentation/http/UserHandler";
import ImageHandler from "./images/presentation/http/ImageHandler";
import ImageRepository from "./images/infrastructure/database/ImageRepository";
import MerchandiseRepository from "./merchandise/infrastructure/database/MerchandiseRepository";
import MerchandiseHandler from "./merchandise/presentation/http/MerchandiseHandler";
import ArtHandler from "./art/presentation/http/ArtHandler";
import ArtRepository from "./art/infrastructure/database/ArtRepository";

export default class Router {
  public static run(
    userRepository: UserRepository,
    imageRepository: ImageRepository,
    merchandiseRepository: MerchandiseRepository,
    artRepository: ArtRepository
  ): ExpressRouter {
    const router: ExpressRouter = ExpressRouter();

    router.use("/v1/auth", UserHandler.router(userRepository));
    router.use("/v1", ImageHandler.router(imageRepository));
    router.use(
      "/v1",
      MerchandiseHandler.router(merchandiseRepository, imageRepository)
    );
    router.use("/v1", ArtHandler.router(artRepository, imageRepository));

    return router;
  }
}
