import express, { Express, Router } from "express";
import path from "path";
import Middleware from "./Middleware";
export default class Server {
  public static run(port: number, router: Router) {
    const app: Express = express();

    app.use(Middleware.cors);
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use("/static", express.static(path.join(__dirname, "../public")));
    app.use("/", router);
    app.listen(port, () => {
      console.log(`The HTTP server is running on port ${port}`);
    });
  }
}
