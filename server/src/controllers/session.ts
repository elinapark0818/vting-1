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

const bcrypt = require("bcrypt");

interface UserType {
  user_id: string;
  password: string;
}

interface SessionController {
  signIn: { post: any };
  signOut: { get: any };
}

export let SessionController = {
  signIn: {
    post: async (req: Request, res: Response) => {
      // 로그인을 위한 이메일, 패스워드 받기
      const { user_id, password }: UserType = req.body;

      try {
        const findUser = await db
          .collection("user")
          .findOne({ user_id: user_id });

        if (findUser) {
          var check = await bcrypt.compare(password, findUser.password);

          if (check) {
            const accessToken = jwt.sign(
              { user_id },
              process.env.ACCESS_SECRET as jwt.Secret,
              { expiresIn: 60 * 60 * 60 }
            );

            return res.status(200).json({
              data: {
                user_data: {
                  _id: findUser._id,
                  user_id: findUser.user_id,
                  nickname: findUser.nickname,
                  image: findUser.image,
                  vote: findUser.vote,
                },
                accessToken: accessToken,
              },
              message: "Successfully logged in",
            });
          } else {
            return res.status(400).json({ message: "Wrong password" });
          }
        } else {
          return res.status(400).json({ message: "There's no ID" });
        }
      } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Bad request" });
      }
    },
  },

  // logout, clear cookie
  signOut: {
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
            process.env.ACCESS_SECRET as jwt.Secret,
            (err) => {
              return res.status(400);
            }
          );

          if (decoded) {
            return res.status(200).json({
              data: { accessToken: "" },
              message: "Successfully logged out",
            });
          } else if (decoded === undefined) {
            return res.status(200);
          }
        } catch (err) {
          console.log(err);
          return res.status(400).json({ message: "Failed logged out" });
        }
      } else {
        res
          .status(200)
          .json({ data: { accessToken: "" }, message: "No token exists" });
      }
    },
  },
};
