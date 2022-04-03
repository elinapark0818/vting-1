import { db } from "..";
import jwt from "jsonwebtoken";
import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";

import dotenv from "dotenv";
dotenv.config();

interface AuthController {
  navBar: { get: any };
}

export let AuthController = {
  navBar: {
    get: async (req: Request, res: Response) => {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
        let authorization: string | undefined = req.headers.authorization;
        let accessToken: string = authorization.split(" ")[1];

        try {
          const decoded: any = jwt.verify(
            accessToken as string,
            process.env.ACCESS_SECRET as jwt.Secret
          );

          const findUser = await db
            .collection("user")
            .findOne({ user_id: decoded.user_id });

          return res.status(200).json({
            data: {
              _id: findUser._id,
              user_id: findUser.user_id,
              nickname: findUser.nickname,
              image: findUser.image,
              vote: findUser.vote,
            },
          });
        } catch (err) {
          console.log(err);
          return res.status(400).json({ message: "Bad request" });
        }
      } else {
        res.status(400).json({ message: "No token exists" });
      }
    },
  },
};
