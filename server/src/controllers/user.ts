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
import { strictEqual } from "assert";
dotenv.config();

// const bcrypt = require("bcrypt");
// const saltRounds = 10;
// const myPlaintextPassword = "sO//p4$$wOrD";
// const someOtherPlaintextPassword = "not_bacon";

// const clientID = process.env.GITHUB_CLIENT_ID;
// const clientSecret = process.env.GITHUB_CLIENT_SECRET;
// const axios = require("axios");

// export default {
//   post: async (req: Request, res: Response) => {
//     const { email } = req.body;

//     try {
//       if (email) {
//         const accessToken = jwt.sign({ email }, process.env.ACCESS_SECRET, {
//           expiresIn: "10h",
//         });

//         console.log("1", accessToken);

//         // email을 playload에 담은 토큰을 쿠키로 전달

//         res.cookie("accessToken", accessToken, {
//           sameSite: "none",
//         });

//         return res.status(200).send("OK");
//       }
//     } catch {
//       return res.status(400).send("NOT OK");
//     }
//   },
// };

interface UserType {
  user_id: string;
  nickname: string;
  password: string;
  image?: string;
  vote?: string[];
}

interface UserController {
  userCheck: { post: any };
  passwordCheck: { post: any };
  signup: { post: any };
  // oauth: { post: any };
  userInfo: { get: any; patch: any };
}

export let UserController = {
  //회원가입과 탈퇴시 모두 사용가능한 체크
  userCheck: {
    post: async (
      req: Request & { body: { user_id: string } },
      res: Response
    ) => {
      try {
        const user_id = await req.body;
        const findUser = await db
          .collection("user")
          .findOne({ user_id: req.body.user_id });
        if (!findUser) {
          return res.status(200).json({
            message: "It doesn't match",
          });
        } else {
          return res.status(200).json({
            message: "Success verified",
          });
        }
      } catch {
        return res.status(400).json({ message: "Bad Request" });
      }
    },
  },

  //회원정보 수정시 사용가능한 체크
  passwordCheck: {
    post: async (
      req: Request & { body: { password: string } },
      res: Response
    ) => {
      function getCookie(name: string) {
        let matches = (req.headers.cookie as string).match(
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

      console.log("user_id", user_id);

      try {
        const password = await req.body;
        const findUser = await db
          .collection("user")
          .findOne({ user_id: user_id.user_id, password: password });

        if (!findUser) {
          return res.status(200).json({
            message: "It doesn't match",
          });
        } else {
          return res.status(200).json({
            message: "Success verified",
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Bad Request" });
      }
    },
  },

  signup: {
    post: async (req: Request & { body: UserType }, res: Response) => {
      // "user_id" : "test@yof.com",
      // "nickname" : "test",
      // "password" : "1234",
      // "image" : null,
      // "vote" : null,
      const { user_id, nickname, password, image, vote } = req.body;

      try {
        if (user_id && password && nickname) {
          // bcrypt.genSalt(saltRounds, function (err: Error, salt: any) {
          //   bcrypt.hash(
          //     myPlaintextPassword,
          //     salt,
          //     function (err: Error, hash: any) {
          //       //store hash in your password DB
          //     }
          //   );
          // });
          db.collection("user").insertOne({
            user_id,
            nickname,
            password,
            image,
            vote,
          });
          // user_id을 playload에 담아 토큰 생성
          const accessToken = jwt.sign(
            { user_id },
            process.env.ACCESS_SECRET as jwt.Secret,
            {
              expiresIn: 60 * 60,
            }
          );
          console.log("1", accessToken);
          // user_id을 playload에 담은 토큰을 쿠키로 전달
          res.cookie("accessToken", accessToken, {
            sameSite: "none",
            secure: true,
          });
          let findUserId = await db
            .collection("user")
            .findOne({ user_id: req.body.user_id });
          console.log(findUserId);
          return res.status(201).json({
            data: {
              _id: findUserId._id,
              user_id: req.body.user_id,
              nickname: req.body.nickname,
              image: req.body.image,
              vote: req.body.vote,
            },
          });
        } else {
          return res.status(203).json({
            data: null,
            message: "Please fill in all required spaces",
          });
        }
      } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Sign up failed" });
      }
    },
  },

  // oauth.post,

  resign: {
    delete: async (req: Request, res: Response) => {
      // FIXME: 만약토큰으로 작업하면 이 부분으로 작업하기
      function getCookie(name: string) {
        let matches = (req.headers.cookie as string).match(
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

      console.log("user_id", user_id);

      try {
        // 유저 정보 삭제하기
        await db.collection("user").deleteOne({ user_id: user_id.user_id });
        // 쿠키에 토큰 삭제하기
        await res.clearCookie("accessToken", {
          sameSite: "none",
          secure: true,
        });
        return res
          .status(200)
          .json({ message: "Successfully account deleted" });
      } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Bad request" });
      }
    },
  },

  userInfo: {
    get: async (req: Request, res: Response) => {
      function getCookie(name: any) {
        const cookie = req.headers.cookie;
        if (cookie) {
          let matches = req.headers.cookie.match(
            new RegExp(
              "(?:^|; )" +
                name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
                "=([^;]*)"
            )
          );
          return matches ? decodeURIComponent(matches[1]) : undefined;
        }
      }

      const accessToken = getCookie("accessToken");

      const user_id: jwt.JwtPayload = jwt.verify(
        accessToken as string,
        process.env.ACCESS_SECRET as jwt.Secret
      );

      console.log("user_id decoded", user_id);

      try {
        const findUser = await db
          .collection("user")
          .findOne({ user_id: user_id.user_id });
        if (findUser) {
          return res.status(200).json({
            data: {
              _id: findUser._id,
              nickname: findUser.nickname,
              user_id: findUser.user_id,
              image: findUser.image,
              vote: findUser.vote,
            },
          });
        } else {
          return res.status(400).json({ message: "Bad request" });
        }
      } catch (err) {
        console.log(err);
      }
    },

    patch: async (
      req: Request & {
        body: { nickname?: string; password?: string; image?: string };
      },
      res: Response
    ) => {
      const { nickname, password, image } = req.body;

      function getCookie(name: string) {
        let matches = String(req.headers.cookie).match(
          new RegExp(
            "(?:^|; )" +
              name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
              "=([^;]*)"
          )
        );
        console.log(req.headers);
        return matches ? decodeURIComponent(matches[1]) : undefined;
      }
      const accessToken = getCookie("accessToken");
      const user_id = jwt.verify(
        accessToken as string,
        process.env.ACCESS_SECRET as jwt.Secret
      );

      console.log("user_id", user_id);

      try {
        const findUser = await db.collection("user").updateOne(
          { user_id: user_id.user_id },
          {
            $set: {
              nickname: req.body.nickname,
              image: req.body.image,
              vote: req.body.vote,
            },
          }
        );
        return res.status(200).json({ message: "Successfully updated" });
      } catch {
        return res.status(400).json({ message: "Bad request" });
      }
    },
  },
};
