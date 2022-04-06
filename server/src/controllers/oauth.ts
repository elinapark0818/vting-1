import { db } from "..";
import jwt, { JwtPayload } from "jsonwebtoken";
import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";

import dotenv from "dotenv";
import { Collection } from "mongodb";
import { decode } from "punycode";
import { dateType } from "aws-sdk/clients/iam";
import { ObjectID } from "bson";
dotenv.config();

interface UserType {
  user_id: string;
  nickname: string;
  image: string;
  provider: string;
}

export let OauthController = {
  test: {
    get: async (req: Request, res: Response) => {
      res.send("oauth test!");
    },
  },

  oauthSignIn: {
    post: async (req: Request, res: Response) => {
      // 로그인을 위한 이메일 받기
      const { user_id }: UserType = req.body;

      try {
        const findUser = await db
          .collection("user")
          .findOne({ user_id: user_id });

        if (findUser) {
          console.log(findUser);

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
          return res.status(400).json({ message: "There's no ID" });
        }
      } catch (err) {
        return res.status(400).json({ message: "Bad request" });
      }
    },
  },

  oauthSignUp: {
    // 비밀번호 없이 signup 하기
    post: async (req: Request & { body: UserType }, res: Response) => {
      const { user_id, nickname, image, provider } = req.body;
      try {
        if (user_id && nickname) {
          await db.collection("user").insertOne(
            {
              user_id,
              nickname,
              image,
              vote: [],
              provider,
            },
            async (err: Error, data: any) => {
              const accessToken = jwt.sign(
                { user_id },
                process.env.ACCESS_SECRET as jwt.Secret,
                {
                  expiresIn: 60 * 60 * 60,
                }
              );

              let findUserId = await db.collection("user").findOne({ user_id });

              console.log(findUserId._id);

              return res.status(201).json({
                data: {
                  user_data: {
                    _id: findUserId._id,
                    user_id: findUserId.user_id,
                    nickname: findUserId.nickname,
                    image: findUserId.image,
                    vote: findUserId.vote,
                  },
                  accessToken: accessToken,
                },
                message: "Successfully Signed Up",
              });
            }
          );
        } else {
          return res.status(400).json({ message: "Sign up failed" });
        }
      } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Sign up failed" });
      }
    },
  },
};
