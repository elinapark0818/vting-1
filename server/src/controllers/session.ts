import { db } from "..";
import jwt from "jsonwebtoken";
import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import { IncomingHttpHeaders, request } from "http";
import { AnyMxRecord } from "dns";
import dotenv from "dotenv";
import { isRegExp } from "util/types";
dotenv.config();
const SALT_ROUNDS = 6;
const bcrypt = require("bcrypt");

interface UserType {
  user_id: string;
  password: string;
}

interface SessionController {
  signIn: { post: any };
  signOut: { get: any };
}

//평문과 hash 된 password 비교  -> 로그인 기능에 사용하기 좋음.
// bcrypt.compare(
//   plaintextPassword,
//   hash,
//   function (err: Error, res: Response) {
//     if (err) {
//       console.log("bcrypt.compare() error : ", err.message);
//     } else {
//       if (res) {
//         console.log("plaintextPassword === hashedPassword");
//       } else {
//         console.log("plaintextPassword !== hashedPassword");
//       }
//     }
//   }
// );

export let SessionController = {
  signIn: {
    post: async (req: Request, res: Response) => {
      // 로그인을 위한 이메일, 패스워드 받기
      const { user_id, password }: UserType = await req.body;

      try {
        const findUser = await db
          .collection("user")
          .findOne({ user_id: user_id });

        var check = await bcrypt.compare(password, findUser.password);

        console.log(check);

        if (check) {
          const accessToken = jwt.sign(
            { user_id },
            process.env.ACCESS_SECRET as jwt.Secret,
            { expiresIn: 60 * 60 }
          );

          // user_id을 playload에 담은 토큰을 쿠키로 전달
          res.cookie("accessToken", accessToken, {
            sameSite: "none",
            secure: true,
            domain: "*.v-ting.net",
          });

          return res.status(200).json({
            data: {
              _id: findUser._id,
              user_id: findUser.user_id,
              nickname: findUser.nickname,
              image: findUser.image,
              vote: findUser.vote,
            },
            message: "Successfully logged in",
          });
        } else {
          return res.status(400).json({ message: "Wrong password" });
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
      function getCookie(name: any) {
        let matches = req.headers.cookie.match(
          new RegExp(
            "(?:^|; )" +
              name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
              "=([^;]*)"
          )
        );
        return matches ? decodeURIComponent(matches[1]) : undefined;
      }

      const accessToken = getCookie("accessToken");

      const user_id = jwt.verify(
        accessToken as string,
        process.env.ACCESS_SECRET as jwt.Secret
      );

      try {
        if (user_id) {
          res.clearCookie("accessToken", { sameSite: "none", secure: true });
          return res.status(200).json({ message: "Successfully logged out" });
        }
      } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Failed logged out" });
      }
    },
  },
};
