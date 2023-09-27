require("dotenv").config();

import { Request, Response, Router } from "express";
import User from "../../domain/entity/User";
import Email from "../../domain/valueobject/Email";
import Name from "../../domain/valueobject/Name";
import Password from "../../domain/valueobject/Password";
import UserRepository from "../../infrastructure/database/UserRepository";
import UserMapper from "./UserMapper";
import jwt from "jsonwebtoken";
import Status from "../../../Status";

export default class UserHandler {
  public static router(userRepository: UserRepository): Router {
    const router: Router = Router();

    router.post("/signup", async (req: Request, res: Response) => {
      try {
        let name: Name = new Name(req.body.first_name, req.body.last_name);
        let email: Email = new Email(req.body.email.toString());
        let password: Password = new Password();
        password.hash(req.body.password);

        const checkEmail: User | undefined = await userRepository.getUser(
          email
        );
        if (checkEmail) {
          return res
            .status(400)
            .json({
              status: Status.Fail,
              message: "email already exist",
            })
            .end();
        }
        let user: User = new User(name, email, false, password);
        userRepository.saveUser(user);
        return res.status(200).json({
          status: Status.Success,
          data: UserMapper.toJSON(user),
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          status: Status.Error,
        });
      }
    });

    router.post("/signin", async (req: Request, res: Response) => {
      try {
        let email: Email = new Email(req.body.email);
        let user: User | undefined = await userRepository.getUser(email);
        if (user?.password?.verify(req.body.password)) {
          return res.status(200).json({
            status: Status.Success,
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
