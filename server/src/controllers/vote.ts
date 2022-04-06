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
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface VoteType {
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
    },
  },

  create: {
    post: async (req: Request & { body: any }, res: Response) => {
      let {
        title,
        format,
        manytimes,
        multiple,
        type,
        items,
        response,
        password,
      }: VoteType = req.body;

      // access code(6-digits) 만들기
      let url = 0;
      while (String(url).length < 6) {
        url = Math.ceil(Math.random() * 1000000);
      }

      if (items !== undefined) {
        // items Array에 count: 0 넣어주기
        if (Array.isArray(items)) {
          for (let el of items) {
            el.count = 0;
          }
        }
        // items 아무것도 안보내줄때 빈객체로 셋팅 해놓기
      } else {
        items = [];
      }
      // response 빈객체로 셋팅 해놓기
      response = [];

      // response 아무것도 안보내줄때 빈객체로 셋팅 해놓기

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
                    isPublic: true,
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
                        isPublic: madeVote.isPublic,
                        undergoing: madeVote.undergoing,
                        created_at: madeVote.created_at,
                        url,
                      },
                    });
                  }
                );
                // FIXME: FORMAT 'open ended'
              } else if (format === "open") {
                db.collection("vote").insertOne(
                  {
                    user_id: data.user_id,
                    url,
                    title,
                    format,
                    manytimes,
                    response,
                    undergoing: true,
                    isPublic: true,
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
                        isPublic: madeVote.isPublic,
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
                    isPublic: true,
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
                        isPublic: madeVote.isPublic,
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
                    isPublic: true,
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
                        isPublic: madeVote.isPublic,
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
  // FIXME: Show Vote
  // 회원, 비회원 분기해서 보여주기
  show_vote: {
    get: async (req: Request & { params: any }, res: Response) => {
      // 비밀번호의 유무에 따라 회원 비회원을 나눠서 데이터 보내기(because. 로그인되어있는 사람이 비회원으로 만든 vote의 V page로 가게되는경우 토큰이 있어도 들어 갈 수 있어야 한다)
      // 변경 => 데이터가 저장된 위치가 collection('vote') or collection('non-member') 인지에 따라 분기시켜주기
      try {
        const findMemberVote = await db
          .collection("vote")
          .findOne({ url: Number(req.params.accessCode) });

        if (
          req.headers.authorization &&
          req.headers.authorization.split(" ")[0] === "Bearer" &&
          findMemberVote
        ) {
          let token: string = req.headers.authorization.split(" ")[1];
          jwt.verify(
            token,
            process.env.ACCESS_SECRET as jwt.Secret,
            async (err, data: any) => {
              // url(req.params.id)로 vote data 가져오기(회원일때 collection -> vote )
              let voteId = await db
                .collection("vote")
                .findOne({ url: Number(req.params.accessCode) });
              voteId = voteId._id;

              // 해당 vote 찾기
              await db
                .collection("vote")
                .findOne(
                  { user_id: data.user_id, _id: new ObjectId(voteId) },
                  (err: Error, data: any) => {
                    console.log("data", data);
                    if (data.format !== "open") {
                      let sumCount: number = 0;
                      for (let el of data.items) {
                        sumCount += el.count;
                      }
                      return res.status(200).json({ data: data, sumCount });
                    } else {
                      return res.status(200).json({ data: data });
                    }
                  }
                );
            }
          );
          // 비회원 vote data 보내기(클라에서 비번으로 접근 여부 판단함)
        } else if (!findMemberVote) {
          // url(req.params.id)로 vote data 가져오기(회원일때 collection -> non-member )
          let voteId = await db
            .collection("non-member")
            .findOne({ url: Number(req.params.accessCode) });
          voteId = voteId._id;

          // 해당 vote 찾기
          await db
            .collection("non-member")
            .findOne({ _id: new ObjectId(voteId) }, (err: Error, data: any) => {
              // 남은시간(분) 계산해서 보내주기
              let overtime =
                (new Date(data.created_at.toString()).getTime() -
                  new Date().getTime()) /
                  (1000 * 60) +
                60;
              overtime = Math.round(overtime);

              if (data.format !== "open") {
                let sumCount: number = 0;
                for (let el of data.items) {
                  sumCount += el.count;
                }
                return res.status(200).json({ data: data, overtime, sumCount });
              } else {
                return res.status(200).json({ data: data, overtime });
              }
            });
        } else {
          // 로그인이 풀리는 경우(accessToken 만료 됬을때)
          return res.status(400).json({ message: "Bad Request" });
        }
      } catch {
        return res.status(400).json({ message: "Bad Request" });
      }
    },
  },

  // FIXME: Delete Vote
  delete: {
    delete: async (req: Request & { params: any }, res: Response) => {
      // url(req.params.id)로 vote data 가져오기
      let voteId = await db
        .collection("vote")
        .findOne({ url: Number(req.params.accessCode) });
      voteId = voteId._id;

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
      const reqData = req.body;

      const findMemberVote = await db
        .collection("vote")
        .findOne({ url: Number(req.params.accessCode) });

      try {
        // 회원인 경우 token 확인 후 내 vote를 수정하기
        if (
          req.headers.authorization &&
          req.headers.authorization.split(" ")[0] === "Bearer" &&
          findMemberVote
        ) {
          let authorization: string | undefined = req.headers.authorization;
          let token: string = authorization.split(" ")[1];
          jwt.verify(
            token,
            process.env.ACCESS_SECRET as jwt.Secret,
            async (err, data: any) => {
              // url(req.params.id)로 vote data 가져오기
              let voteId = await db
                .collection("vote")
                .findOne({ url: Number(req.params.accessCode) });
              voteId = voteId._id;

              // 토큰이 확인되면 vote collection에서 해당유저가 만들었던 vote중 요청된 보트가 일치하면 patch 가능
              await db
                .collection("vote")
                .findOne(
                  { _id: new ObjectId(voteId), user_id: data.user_id },
                  async (err: Error, data: any) => {
                    // undergoing === true => false
                    if (
                      reqData.isActive !== null &&
                      reqData.isPublic === null
                    ) {
                      if (data.undergoing === true) {
                        await db
                          .collection("vote")
                          .updateOne(
                            { _id: new ObjectId(voteId) },
                            { $set: { undergoing: false } },
                            async (err: Error, data: any) => {
                              return res.status(200).json({
                                isActive: false,
                                isPublic: null,
                              });
                            }
                          );
                        // undergoing === false => true
                      } else if (data.undergoing === false) {
                        await db
                          .collection("vote")
                          .updateOne(
                            { _id: new ObjectId(voteId) },
                            { $set: { undergoing: true } },
                            async (err: Error, data: any) => {
                              return res.status(200).json({
                                isActive: true,
                                isPublic: null,
                              });
                            }
                          );
                      }
                    } else if (
                      reqData.isActive === null &&
                      reqData.isPublic !== null
                    ) {
                      // isPublic = true ===> false
                      if (data.isPublic === true) {
                        db.collection("vote").updateOne(
                          { _id: new ObjectId(voteId) },
                          { $set: { isPublic: false } },
                          async (err: Error, data: any) => {
                            return res
                              .status(200)
                              .json({ isActive: null, isPublic: false });
                          }
                        );
                        // isPublic = false ===> true
                      } else if (data.isPublic === false) {
                        db.collection("vote").updateOne(
                          { _id: new ObjectId(voteId) },
                          { $set: { isPublic: true } },
                          async (err: Error, data: any) => {
                            return res
                              .status(200)
                              .json({ isActive: null, isPublic: true });
                          }
                        );
                      }
                    }
                  }
                );
            }
          );
          // 비회원일떄 수정 하기(undergoing만 바꿀 수 있음)
        } else if (!findMemberVote) {
          // url(req.params.id)로 vote data 가져오기
          let voteId = await db
            .collection("non-member")
            .findOne({ url: Number(req.params.accessCode) });
          voteId = voteId._id;

          await db
            .collection("non-member")
            .findOne(
              { _id: new ObjectId(voteId) },
              async (err: Error, data: any) => {
                if (data.undergoing === true) {
                  await db
                    .collection("non-member")
                    .updateOne(
                      { _id: new ObjectId(voteId) },
                      { $set: { undergoing: false } },
                      async (err: Error, data: any) => {
                        return res.status(200).json({ isActive: false });
                      }
                    );
                } else if (data.undergoing === false) {
                  await db
                    .collection("non-member")
                    .updateOne(
                      { _id: new ObjectId(voteId) },
                      { $set: { undergoing: true } },
                      async (err: Error, data: any) => {
                        return res.status(200).json({ isActive: true });
                      }
                    );
                }
              }
            );
        } else {
          return res.status(400).json({ message: "Bad Request" });
        }
      } catch {
        return res.status(400).json({ message: "Bad Request" });
      }
    },
  },
};
