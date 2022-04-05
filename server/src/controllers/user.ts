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

          console.log(findUserWithId);
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

              console.log("check", check);

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
              console.log("salt", salt);

              bcrypt.hash(password, salt, function (err: Error, hash: string) {
                console.log("hash", hash);

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

                    console.log(findUserId._id);

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
            // console.log("decoded", decoded);
            // console.log("finduser", findUser);

            const countUserVote = await db
              .collection("vote")
              .find({ user_id: decoded.user_id })
              .count();

            // console.log(countUserVote);

            return res.status(200).json({
              data: {
                _id: findUser._id,
                nickname: findUser.nickname,
                user_id: findUser.user_id,
                image: findUser.image,
                voteCount: countUserVote,
              },
            });
          } else if (req.query) {
            var q: any = req.query.q;

            const findUserVote: Vote[] = await db
              .collection("vote")
              .find({ user_id: decoded.user_id })
              .toArray();

            // console.log("findUserVote", findUserVote);

            var voteInfo = [];
            //q=1 일때 0~9까지 q=2일때 10~19까지 q=3일때 20~29까지 q=10일때 90~99까지 q=100일때 990~999까지
            for (let i = (q - 1) * 10; i < q * 10; i++) {
              if (findUserVote[i] === undefined) break;
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

            return res.status(200).json({
              vote: voteInfo,
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
                // console.log("salt", salt);

                bcrypt.hash(
                  req.body.password,
                  salt,
                  function (err: Error, hash: string) {
                    // console.log("hash", hash);

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
