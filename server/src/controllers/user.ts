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

const SALT_ROUNDS = 6;
const bcrypt = require("bcrypt");

const multerS3 = require("multer-s3");

interface UserType {
  user_id: string;
  nickname: string;
  password: string;
  image?: FormData;
  vote?: string[];
}

interface UserController {
  userCheck: { post: any };
  signup: { post: any };
  // oauth: { post: any };
  resign: { delete: any };
  userInfo: { get: any; patch: any };
}

interface Vote {
  _id: ObjectID;
  user_id: string;
  url: number;
  title: string;
  format: string;
  manytimes: Boolean;
  items: any[];
  undergoing: Boolean;
  isPublic: Boolean;
  created_at: dateType;
}

export let UserController = {
  //회원가입과 탈퇴시 모두 사용가능한 체크
  userCheck: {
    post: async (
      req: Request & { body: { user_id?: string; password?: string } },
      res: Response
    ) => {
      try {
        const { user_id, password } = req.body;

        if (user_id) {
          const findUserWithId = await db
            .collection("user")
            .findOne({ user_id: user_id });

          if (!findUserWithId) {
            return res.status(200).json({
              message: "It doesn't match",
            });
          } else {
            return res.status(200).json({
              message: "Success verified",
            });
          }
        } else if (password) {
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

              const findUserWithPw = await db
                .collection("user")
                .findOne({ user_id: decoded.user_id });

              var check = await bcrypt.compare(
                password,
                findUserWithPw.password
              );

              if (!check) {
                return res.status(200).json({
                  message: "It doesn't match",
                });
              } else {
                return res.status(200).json({
                  message: "Success verified",
                });
              }
            } catch {
              res.status(400).json({ message: "Bad Request" });
            }
          }
        }
      } catch {
        return res.status(400).json({ message: "Bad Request" });
      }
    },
  },

  signup: {
    post: async (req: Request & { body: UserType }, res: Response) => {
      const { user_id, nickname, password } = req.body;
      try {
        if (user_id && password && nickname) {
          bcrypt.genSalt(SALT_ROUNDS, function (err: Error, salt: string) {
            if (err) {
              console.log("genSalt Error: " + err);
            } else {
              bcrypt.hash(password, salt, function (err: Error, hash: string) {
                db.collection("user").insertOne(
                  {
                    user_id: req.body.user_id,
                    nickname: req.body.nickname,
                    password: hash,
                    image:
                      "https://vtingimage.s3.ap-northeast-2.amazonaws.com/uploads/yof_logo-17.jpg",
                    vote: [],
                  },
                  async (err: Error, data: any) => {
                    const accessToken = jwt.sign(
                      { user_id },
                      process.env.ACCESS_SECRET as jwt.Secret,
                      {
                        expiresIn: 60 * 60 * 60,
                      }
                    );

                    let findUserId = await db
                      .collection("user")
                      .findOne({ user_id: req.body.user_id });

                    return res.status(201).json({
                      data: {
                        user_data: {
                          _id: findUserId._id,
                          user_id: req.body.user_id,
                          nickname: req.body.nickname,
                          image:
                            "https://vtingimage.s3.ap-northeast-2.amazonaws.com/uploads/yof_logo-17.jpg",
                          vote: req.body.vote,
                        },
                        accessToken: accessToken,
                      },
                      message: "Successfully Signed Up",
                    });
                  }
                );
                if (err) {
                  console.log("bycrpt hash method error : ", err.message);
                } else {
                }
              });
            }
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
          // 보트 전부 삭제하고 유저 삭제하기
          await db.collection("vote").deleteMany({ user_id: decoded.user_id });
          await db.collection("user").deleteOne({ user_id: decoded.user_id });
          // 쿠키에 토큰 삭제하기
          return res.status(200).json({
            data: { accessToken: "" },
            message: "Successfully account deleted",
          });
        } catch (err) {
          console.log(err);
          return res.status(400).json({ message: "Bad request" });
        }
      }
    },
  },

  userInfo: {
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
          if (decoded && !req.query.q) {
            const findUser = await db
              .collection("user")
              .findOne({ user_id: decoded.user_id });

            const countUserVote = await db
              .collection("vote")
              .find({ user_id: decoded.user_id })
              .count();

            return res.status(200).json({
              data: {
                _id: findUser._id,
                nickname: findUser.nickname,
                user_id: findUser.user_id,
                image: findUser.image,
                voteCount: countUserVote,
                provider: findUser.provider,
              },
            });
          } else if (req.query) {
            var q: any = req.query.q;

            const findUserVote: Vote[] = await db
              .collection("vote")
              .find({ user_id: decoded.user_id })
              .toArray();

            var voteInfo = [];

            const countUserVote = await db
              .collection("vote")
              .find({ user_id: decoded.user_id })
              .count();

            // countUserVote가 예를 들면 32이면
            // q=4 일때 0~1까지 q=3일때 2~11까지 q=2일때 12~21(20뺀거~11뺀거)까지 q=1일때 22~31(10뺀거~1뺀거)
            // countUserVote가 예를 들면 15이면
            //  q=2일때 0~4(20뺀거~11뺀거)까지 q=1일때 5~14(10뺀거~1뺀거)
            for (
              let i = countUserVote - 10 * q;
              i <= countUserVote - 10 * q + 9;
              i++
            ) {
              if (findUserVote[i] === undefined) continue;
              const vote: any = {
                title: findUserVote[i].title,
                format: findUserVote[i].format,
                isPublic: findUserVote[i].isPublic,
                undergoing: findUserVote[i].undergoing,
                created_at: findUserVote[i].created_at,
                url: findUserVote[i].url,
              };
              voteInfo.push(vote);
            }

            const reverseVote = voteInfo.reverse();

            return res.status(200).json({
              vote: reverseVote,
            });
          } else {
            return res.status(400).json({ message: "Bad request" });
          }
        } catch (err) {
          console.log(err);
        }
      }
    },

    patch: async (
      req: Request & {
        body: { nickname?: string; password?: string };
      },
      res: Response
    ) => {
      const { nickname, password } = req.body;

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

          await bcrypt.genSalt(
            SALT_ROUNDS,
            function (err: Error, salt: string) {
              if (err) {
                console.log("genSalt Error: " + err);
              } else {
                bcrypt.hash(
                  req.body.password,
                  salt,
                  function (err: Error, hash: string) {
                    db.collection("user").updateOne(
                      { user_id: decoded.user_id },
                      {
                        $set: {
                          nickname: req.body.nickname || findUser.nickname,
                          password: hash || findUser.password,
                        },
                      }
                    );
                    return res
                      .status(200)
                      .json({ message: "Successfully updated" });
                  }
                );
              }
            }
          );
        } catch {
          res.status(400).json({ message: "Bad request" });
        }
      } else {
        res.status(400).json({ message: "No token exists" });
      }
    },
  },
};
