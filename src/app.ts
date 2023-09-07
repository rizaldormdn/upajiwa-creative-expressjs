require("dotenv").config();

import mysql, { Connection } from "mysql2";
import Router from "./Router";
import Server from "./Server";
import UserRepository from "./user/infrastructure/database/UserRepository";

const connection: Connection = mysql.createConnection({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
});

const userRepository: UserRepository = new UserRepository(connection);

Server.run(Number(process.env.PORT), Router.run(userRepository));
