require("dotenv").config();

import mongoose from "mongoose";
import Router from "./Router";
import Server from "./Server";

mongoose.connect(
  `${process.env.MONGODB_URI}${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "conection error: "));
db.once("open", function () {
  console.log("mongoDB Connected!");
});

Server.run(Number(process.env.PORT), Router.run());
