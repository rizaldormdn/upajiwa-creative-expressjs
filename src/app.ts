require("dotenv").config();

import mysql, { Connection } from "mysql2";
import Router from "./Router";
import Server from "./Server";
import ArtRepository from "./art/infrastructure/database/ArtRepository";
import ImageRepository from "./images/infrastructure/database/ImageRepository";
import MerchandiseRepository from "./merchandise/infrastructure/database/MerchandiseRepository";
import UserRepository from "./user/infrastructure/database/UserRepository";

const connection: Connection = mysql.createConnection({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
});

const userRepository: UserRepository = new UserRepository(connection);
const imageRepository: ImageRepository = new ImageRepository(connection);
const merchandiseRepository: MerchandiseRepository = new MerchandiseRepository(
  connection
);
const artRepository: ArtRepository = new ArtRepository(connection);

Server.run(
  Number(process.env.PORT),
  Router.run(
    userRepository,
    imageRepository,
    merchandiseRepository,
    artRepository
  )
);
