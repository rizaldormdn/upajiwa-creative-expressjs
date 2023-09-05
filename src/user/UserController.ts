require("dotenv").config();

import { Request, Response, Router } from "express";
import UserModels from "./UserModels";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Status from "../Status";
import { body, validationResult } from "express-validator";
import Middleware from "../Middleware";

export default class UserController {
  public static router(): Router {
    const router: Router = Router();

    router.post(
      "/signup",
      body("username").notEmpty(),
      body("email").notEmpty().isEmail(),
      body("password").notEmpty(),
      body("role").notEmpty(),
      async (req: Request, res: Response) => {
        try {
          const { username, email, password, role } = req.body;
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(428).json({
              status: Status.Fail,
              error: errors.array(),
            });
          }
          const emailExist = await UserModels.findOne({ email });
          if (emailExist) {
            return res.status(428).json({
              message: "email is exist",
            });
          }

          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(password, salt);

          const user = new UserModels({
            username,
            email,
            password: hash,
            role,
          });

          const data = await user.save();
          if (!data) {
            return res.status(500).json({
              message: "Failed to register",
            });
          }

          return res.status(200).json({
            message: "success",
            data,
          });
        } catch (error) {
          return res.status(500).json({
            message: "Failed",
          });
        }
      }
    );

    router.post(
      "/signin",
      body("email").notEmpty().isEmail(),
      body("password").notEmpty(),
      async (req: Request, res: Response) => {
        try {
          const { email, password } = req.body;
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(428).json({
              status: Status.Fail,
              error: errors.array(),
            });
          }
          const user = await UserModels.findOne({ email });
          if (!user) {
            return res.status(404).json({
              message: "user not found",
            });
          }
          const isMatch = bcrypt.compareSync(password, user.password);
          if (!isMatch) {
            return res.status(428).json({
              message: "wrong password",
            });
          }
          return res.status(200).json({
            message: "Login success",
            data: {
              access_token: jwt.sign(
                {
                  id: user._id,
                  username: user.username,
                  email: user.email,
                  password: user.password,
                  role: user.role,
                },
                String(process.env.ACCESS_TOKEN_SECRET),
                {
                  expiresIn: String(process.env.ACCESS_TOKEN_EXPIRES_IN),
                }
              ),
              refresh_token: jwt.sign(
                {
                  id: user._id,
                  username: user.username,
                  email: user.email,
                  password: user.password,
                  role: user.role,
                },
                String(process.env.REFRESH_TOKEN_SECRET)
              ),
            },
          });
        } catch (error) {
          console.log(error);

          return res.status(500).json({
            message: "Login failed",
          });
        }
      }
    );

    router.post("/refresh-token", async (req: Request, res: Response) => {
      try {
        if (!req.body.refresh_token) {
          return res.status(500).json({
            message: "failed refresh token",
          });
        }
        const token = jwt.verify(
          req.body.refresh_token,
          String(process.env.REFRESH_TOKEN_SECRET)
        );
        return res.status(200).json({
          message: "refresh token success",
          data: {
            access_token: jwt.sign(
              { token },
              String(process.env.ACCESS_TOKEN_SECRET),
              {
                expiresIn: String(process.env.ACCESS_TOKEN_EXPIRES_IN),
              }
            ),
            refresh_token: jwt.sign(
              { token },
              String(process.env.REFRESH_TOKEN_SECRET)
            ),
          },
        });
      } catch (error) {
        return res.status(500).json({
          message: "refresh token failed",
        });
      }
    });

    router.get(
      "/me",
      Middleware.authentication,
      async (req: Request, res: Response) => {
        try {
          return res.status(200).json({
            status: Status.Success,
            data: {
              user: res.locals.user,
            },
          });
        } catch (error) {
          return res.status(500).json({
            status: Status.Error,
          });
        }
      }
    );

    router.get(
      "/user",
      [Middleware.authentication, Middleware.authenticationRole("admin")],
      async (req: Request, res: Response) => {
        try {
          const user = await UserModels.find();
          return res.status(200).json({
            status: Status.Success,
            user,
          });
        } catch (error) {
          return res.status(500).json({
            status: Status.Error,
          });
        }
      }
    );

    router.delete("/user/:email", [
      Middleware.authentication,
      Middleware.authenticationRole("admin"),
      async (req: Request, res: Response) => {
        try {
          const data = await UserModels.deleteOne({ email: req.params.email });
          return res.status(200).json({
            status: Status.Success,
            data,
          });
        } catch (error) {
          return res.status(500).json({
            status: Status.Error,
          });
        }
      },
    ]);
    return router;
  }
}
