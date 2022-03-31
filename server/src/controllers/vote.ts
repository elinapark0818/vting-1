import { db } from "..";
import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import { request } from "http";
import { read } from "fs";
import { ObjectId } from "mongodb";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { off } from "process";
dotenv.config();

interface VoteType1 {
  title: string;
  format: string;
  manytimes: string;
  multiple?: string;
  type?: string[];
  items?: { idx: number; content: string; count: number }[];
  undergoing?: true;
  response: { idx: number; content: string }[];
  password?: string;
}

export let VoteController = {
  test: {
    get: async (req: Request, res: Response) => {
      db.collection("non-member").insertOne({
        test: true,
        created_at: new Date(),
      });
      res.send("vote test!!");
    },
  },

  create: {
    post: async (req: Request & { body: any }, res: Response) => {
      const {
        title,
        format,
        manytimes,
        multiple,
        type,
        items,
        response,
        password,
      }: VoteType1 = req.body;

      // access code(6-digits) 만들기
      let randomNum: any = Math.random();
      let url = randomNum.toFixed(6) * 1000000;

      try {
        // 헤더에 token 받아오기
        let userId: string;
        if (
          req.headers.authorization &&
          req.headers.authorization.split(" ")[0] === "Bearer" &&
          !password
        ) {
          let authorization: string | undefined = req.headers.authorization;
          let token: string = authorization.split(" ")[1];
          jwt.verify(
            token,
            process.env.ACCESS_SECRET as jwt.Secret,
            async (err, data: any) => {
              // user_id 변수 설정
              userId = data.user_id;

              // format에 따라 vote 데이터 DB 저장하기
              // FIXME: FORMAT 'bar'
              if (format === "bar") {
                let objectId: string;

                await db.collection("vote").insertOne(
                  {
                    user_id: data.user_id,
                    url,
                    title,
                    format,
                    type,
                    items,
                    multiple,
                    manytimes,
                    undergoing: true,
                    status: "public",
                    created_at: new Date(),
                  },
                  async (err: Error, data: any) => {
                    // random url(6digit) 만들어 주기
                    objectId = await data.insertedId.toString();

                    // 유저 데이터에 vote 넣어주기
                    await db
                      .collection("user")
                      .updateOne(
                        { user_id: userId },
                        { $push: { vote: new ObjectId(objectId) } }
                      );

                    // 만들어진 투표 => 골라서 응답 보내주기
                    let madeVote = await db
                      .collection("vote")
                      .findOne({ _id: new ObjectId(objectId) });

                    // 응답 보내기
                    return res.status(201).json({
                      data: {
                        _id: madeVote._id,
                        title: madeVote.title,
                        items: madeVote.items,
                        url,
                        status: madeVote.status,
                        undergoing: madeVote.undergoing,
                        created_at: madeVote.created_at,
                      },
                    });
                  }
                );
                // FIXME: FORMAT 'open ended'
              } else if (format === "open") {
                console.log("open ended start");
                db.collection("vote").insertOne(
                  {
                    user_id: data.user_id,
                    url,
                    title,
                    format,
                    manytimes,
                    response,
                    undergoing: true,
                    status: "public",
                    created_at: new Date(),
                  },
                  async (err: Error, data: any) => {
                    // 방금 만든 objectId 보내주기
                    let objectId: string = await data.insertedId.toString();
                    let madeVote = await db
                      .collection("vote")
                      .findOne({ _id: new ObjectId(objectId) });

                    // 유저 데이터에 vote 넣어주기
                    await db
                      .collection("user")
                      .updateOne(
                        { user_id: userId },
                        { $push: { vote: new ObjectId(objectId) } }
                      );

                    // 응답 보내기
                    return res.status(201).json({
                      data: {
                        _id: madeVote._id,
                        title: madeVote.title,
                        response: madeVote.response,
                        status: madeVote.status,
                        undergoing: madeVote.undergoing,
                        created_at: madeVote.created_at,
                        url,
                      },
                    });
                  }
                );
                // FIXME: FORMAT 'vs'
              } else if (format === "versus") {
                db.collection("vote").insertOne(
                  {
                    user_id: data.user_id,
                    url,
                    title,
                    format,
                    manytimes,
                    items,
                    undergoing: true,
                    status: "public",
                    created_at: new Date(),
                  },
                  async (err: Error, data: any) => {
                    // 방금 만든 objectId 보내주기
                    let objectId: string = await data.insertedId.toString();
                    let madeVote = await db
                      .collection("vote")
                      .findOne({ _id: new ObjectId(objectId) });

                    // 유저 데이터에 vote 넣어주기
                    await db
                      .collection("user")
                      .updateOne(
                        { user_id: userId },
                        { $push: { vote: new ObjectId(objectId) } }
                      );

                    // 응답 보내기
                    return res.status(201).json({
                      data: {
                        _id: madeVote._id,
                        title: madeVote.title,
                        items: madeVote.items,
                        status: madeVote.status,
                        undergoing: madeVote.undergoing,
                        created_at: madeVote.created_at,
                        url,
                      },
                    });
                  }
                );
                // FIXME: FORMAT 'word cloud'
              } else if (format === "word") {
                db.collection("vote").insertOne(
                  {
                    user_id: data.user_id,
                    url,
                    title,
                    format,
                    manytimes,
                    items,
                    undergoing: true,
                    status: "public",
                    created_at: new Date(),
                  },
                  async (err: Error, data: any) => {
                    // 방금 만든 objectId 보내주기
                    let objectId: string = await data.insertedId.toString();
                    let madeVote = await db
                      .collection("vote")
                      .findOne({ _id: new ObjectId(objectId) });

                    // 유저 데이터에 vote 넣어주기
                    await db
                      .collection("user")
                      .updateOne(
                        { user_id: userId },
                        { $push: { vote: new ObjectId(objectId) } }
                      );

                    // 응답 보내기
                    return res.status(201).json({
                      data: {
                        _id: madeVote._id,
                        title: madeVote.title,
                        items: madeVote.items,
                        status: madeVote.status,
                        undergoing: madeVote.undergoing,
                        created_at: madeVote.created_at,
                        url,
                      },
                    });
                  }
                );
              }
            }
          );
        } else if (password) {
          // TODO: 비회원 일때 생성 관련된 응답 만들기!
          // TODO: non-member collection에 데이터 넣기(1시간후 자동 삭제됨)
          // TODO: 유저아이디 X, 유저데이터에 넣기 X, 임시비번 저장하기, 임시비번으로 분기 해서 실행시키기
          // TODO: timeover date 추가하기 (남은시간 = 생성시간 - 현재시간 > 0)

          // format에 따라 vote 데이터 DB 저장하기
          // FIXME: FORMAT 'bar'
          if (format === "bar") {
            let objectId: string;

            await db.collection("non-member").insertOne(
              {
                password,
                url,
                title,
                format,
                type,
                items,
                multiple,
                manytimes,
                undergoing: true,
                created_at: new Date(),
              },
              async (err: Error, data: any) => {
                // random url(6digit) 만들어 주기
                objectId = await data.insertedId.toString();

                // 만들어진 투표 => 골라서 응답 보내주기
                let madeVote = await db
                  .collection("non-member")
                  .findOne({ _id: new ObjectId(objectId) });

                // 남은시간(분) 계산해서 보내주기
                let overtime =
                  (new Date(madeVote.created_at.toString()).getTime() -
                    new Date().getTime()) /
                    (1000 * 60) +
                  60;
                overtime = Math.round(overtime);

                // 응답 보내기
                return res.status(201).json({
                  data: {
                    _id: madeVote._id,
                    title: madeVote.title,
                    items: madeVote.items,
                    url,
                    created_at: madeVote.created_at,
                    undergoing: madeVote.undergoing,
                    overtime,
                  },
                });
              }
            );
            // FIXME: FORMAT 'open ended'
          } else if (format === "open") {
            db.collection("non-member").insertOne(
              {
                password,
                url,
                title,
                format,
                manytimes,
                response,
                undergoing: true,
                created_at: new Date(),
              },
              async (err: Error, data: any) => {
                // 방금 만든 objectId 보내주기
                let objectId: string = await data.insertedId.toString();
                let madeVote = await db
                  .collection("non-member")
                  .findOne({ _id: new ObjectId(objectId) });

                // 남은시간(분) 계산해서 보내주기
                let overtime =
                  (new Date(madeVote.created_at.toString()).getTime() -
                    new Date().getTime()) /
                    (1000 * 60) +
                  60;
                overtime = Math.round(overtime);

                // 응답 보내기
                return res.status(201).json({
                  data: {
                    _id: madeVote._id,
                    title: madeVote.title,
                    response: madeVote.response,
                    url,
                    created_at: madeVote.created_at,
                    undergoing: madeVote.undergoing,
                    overtime,
                  },
                });
              }
            );
            // FIXME: FORMAT 'vs'
          } else if (format === "versus") {
            db.collection("non-member").insertOne(
              {
                password,
                url,
                title,
                format,
                manytimes,
                items,
                undergoing: true,
                created_at: new Date(),
              },
              async (err: Error, data: any) => {
                // 방금 만든 objectId 보내주기
                let objectId: string = await data.insertedId.toString();
                let madeVote = await db
                  .collection("non-member")
                  .findOne({ _id: new ObjectId(objectId) });

                // 남은시간(분) 계산해서 보내주기
                let overtime =
                  (new Date(madeVote.created_at.toString()).getTime() -
                    new Date().getTime()) /
                    (1000 * 60) +
                  60;
                overtime = Math.round(overtime);

                // 응답 보내기
                return res.status(201).json({
                  data: {
                    _id: madeVote._id,
                    title: madeVote.title,
                    items: madeVote.items,
                    url,
                    created_at: madeVote.created_at,
                    undergoing: madeVote.undergoing,
                    overtime,
                  },
                });
              }
            );
            // FIXME: FORMAT 'word cloud'
          } else if (format === "word") {
            db.collection("non-member").insertOne(
              {
                password,
                url,
                title,
                format,
                manytimes,
                items,
                undergoing: true,
                created_at: new Date(),
              },
              async (err: Error, data: any) => {
                // 방금 만든 objectId 보내주기
                let objectId: string = await data.insertedId.toString();
                let madeVote = await db
                  .collection("non-member")
                  .findOne({ _id: new ObjectId(objectId) });

                // 남은시간(분) 계산해서 보내주기
                let overtime =
                  (new Date(madeVote.created_at.toString()).getTime() -
                    new Date().getTime()) /
                    (1000 * 60) +
                  60;
                overtime = Math.round(overtime);

                // 응답 보내기
                return res.status(201).json({
                  data: {
                    _id: madeVote._id,
                    title: madeVote.title,
                    items: madeVote.items,
                    url,
                    created_at: madeVote.created_at,
                    undergoing: madeVote.undergoing,
                    overtime,
                  },
                });
              }
            );
          }
        }
      } catch {
        return res.status(400);
      }
    },
  },

  delete: {
    delete: async (req: Request & { params: any }, res: Response) => {
      const voteId = req.params.id;

      try {
        //TODO: user data에 해당 vote(배열로 되어있음) 삭제해야됨
        // 만약 유저가 여러가지 vote를 만들었다면 vote삭제시 user의 vote array에서 해당 vote를 삭제해야 된다.
        if (
          req.headers.authorization &&
          req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
          let authorization: string | undefined = req.headers.authorization;
          let token: string = authorization.split(" ")[1];
          jwt.verify(
            token,
            process.env.ACCESS_SECRET as jwt.Secret,
            async (err, data: any) => {
              // user collection에서 vote array 데이터 중 일부 데이터 삭제하기($pull)
              await db
                .collection("user")
                .updateOne(
                  { user_id: data.user_id },
                  { $pull: { vote: new ObjectId(voteId) } }
                );

              // user vote 삭제 후 vote data 삭제
              await db
                .collection("vote")
                .deleteOne({ _id: new ObjectId(voteId) }, async () => {
                  return res
                    .status(200)
                    .json({ message: "Successfully deleted" });
                });
            }
          );
        }
      } catch {
        return res.status(400).json({ message: "Bad Request" });
      }
    },
  },

  undergoingAndPublic: {
    patch: async (req: Request & { params: any; body: any }, res: Response) => {
      const voteId = req.params;
      const reqData = req.body;

      try {
        // 회원인 경우 token 확인 후 내 vote를 수정하기
        if (
          req.headers.authorization &&
          req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
          let authorization: string | undefined = req.headers.authorization;
          let token: string = authorization.split(" ")[1];
          jwt.verify(
            token,
            process.env.ACCESS_SECRET as jwt.Secret,
            async (err, data: any) => {
              // 토큰이 확인되면 vote collection에서 해당유저가 만들었던 vote중 요청된 보트가 일치하면 patch 가능
              await db
                .collection("vote")
                .findOne(
                  { _id: new ObjectId(voteId), user_id: data.user_id },
                  (err: Error, data: any) => {
                    // undergoing === true => false

                    console.log("reqData", req.body);

                    if (reqData.isActive !== null && reqData.status === null) {
                      if (reqData.isActive) {
                        db.collection("vote").updateOne(
                          { _id: new ObjectId(voteId) },
                          { $set: { undergoing: true } },
                          async (err: Error, data: any) => {
                            return res.status(200).json({ isActive: true });
                          }
                        );
                      } else {
                        db.collection("vote").updateOne(
                          { _id: new ObjectId(voteId) },
                          { $set: { undergoing: false } },
                          async (err: Error, data: any) => {
                            return res.status(200).json({ isActive: false });
                          }
                        );
                      }
                    } else if (
                      reqData.isActive === null &&
                      reqData.status !== null
                    ) {
                      if (reqData.status === "public") {
                        db.collection("vote").updateOne(
                          { _id: new ObjectId(voteId) },
                          { $set: { undergoing: "public" } },
                          async (err: Error, data: any) => {
                            return res
                              .status(200)
                              .json({ undergoing: "public" });
                          }
                        );
                      } else {
                        db.collection("vote").updateOne(
                          { _id: new ObjectId(voteId) },
                          { $set: { undergoing: "private" } },
                          async (err: Error, data: any) => {
                            return res
                              .status(200)
                              .json({ undergoing: "private" });
                          }
                        );
                      }
                    }
                  }
                );
            }
          );
          // 비회원일떄 수정 하기(undergoing만 바꿀 수 있음)
        } else {
          if (reqData.undergoing === true) {
            db.collection("vote").updateOne(
              { _id: new ObjectId(voteId) },
              { $set: { undergoing: true } },
              async (err: Error, data: any) => {
                return res.status(200).json({ isActive: true });
              }
            );
          } else {
            db.collection("vote").updateOne(
              { _id: new ObjectId(voteId) },
              { $set: { undergoing: false } },
              async (err: Error, data: any) => {
                return res.status(200).json({ isActive: false });
              }
            );
          }
        }
      } catch {
        return res.status(400).json({ message: "Bad Request" });
      }
    },
  },
};
