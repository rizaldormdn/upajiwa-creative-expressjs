require("dotenv").config();

import { Request, Response, Router } from "express";
import User from "../domain/entity/User";
import Email from "../domain/valueobject/Email";
import Name from "../domain/valueobject/Name";
import Password from "../domain/valueobject/Password";
import UserRepository from "../infrastructure/database/UserRepository";
import UserMapper from "./http/UserMapper";
import jwt from "jsonwebtoken";

export default class UserController {
  public static router(userRepository: UserRepository): Router {
    const router: Router = Router();

    router.post("/signup", async (req: Request, res: Response) => {
      try {
        let name: Name = new Name(req.body.firstname, req.body.lastname);
        let email: Email = new Email(req.body.email.toString());
        let password: Password = new Password();
        password.hash(req.body.password);

        let user: User = new User(name, email, false, password, undefined);
        userRepository.saveUser(user);
        return res.status(200).json({
          message: "success",
          data: UserMapper.toJSON(user),
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          message: "Failed",
        });
      }
    });

    router.post("/signin", async (req: Request, res: Response) => {
      try {
        let email: Email = new Email(req.body.email);
        let user: User | undefined = await userRepository.getUser(email);
        if (user?.password?.verify(req.body.password)) {
          return res.status(200).json({
            message: "Login success",
            data: {
              access_token: jwt.sign(
                UserMapper.toJSON(user),
                String(process.env.ACCESS_TOKEN_SECRET),
                {
                  expiresIn: String(process.env.ACCESS_TOKEN_EXPIRES_IN),
                }
              ),
              refresh_token: jwt.sign(
                UserMapper.toJSON(user),
                String(process.env.REFRESH_TOKEN_SECRET)
              ),
            },
          });
        }
      } catch (error) {
        console.log(error);

        return res.status(500).json({
          message: "Login failed",
        });
      }
    });
    return router;
  }
}
