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
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");

// QRcode

interface VoteType1 {
  title: string;
  format: string;
  manytimes: string;
  multiple?: string;
  type?: string[];
  items?: { idx: number; content: string; count: number }[];
  undergoing?: true;
  response: { idx: number; content: string }[];
}

// interface VoteType2 {
//   title: string;
//   format: string;
//   manytimes: string;
//   multiple?: string;
//   type?: string[];
//   items?: { idx: number; content: string; count: number }[];
//   undergoing: true;
// }

export let VoteController = {
  test: {
    get: async (req: Request, res: Response) => {
      QRCode.toString(
        "www.daum.net",
        // { type: "terminal" },
        function (err: Error, url: any) {
          console.log(url);
          res.send(url);
        }
      );
    },
  },

  create: {
    post: async (req: Request & { body: any }, res: Response) => {
      // req.body
      const {
        title,
        format,
        manytimes,
        multiple,
        type,
        items,
        response,
      }: VoteType1 = req.body;

      // access code(6-digits) 만들기
      let randomNum: any = Math.random();
      let url = randomNum.toFixed(6) * 1000000;
      //TODO: 마지막 자리가 0이면 다섯자리만 나옴.. 지금.. 아니면 6자리.

      // user_id 가져오기 (from accessToken)
      // const token = res.header;
      // const accessToken: any = token.accessToken.split(" ")[1];
      // const { user_id } = jwt.verify(accessToken, process.env.ACCESS_SECRET);

      try {
        // format에 따라 vote 데이터 DB 저장하기
        // FIXME: FORMAT 'bar'
        if (format === "bar") {
          let objectId: string;
          db.collection("vote").insertOne(
            {
              // user_id,
              url,
              title,
              format,
              type,
              items,
              multiple,
              manytimes,
              undergoing: true,
              create_at: new Date(),
            },
            async (err: Error, data: any) => {
              // random url(6digit) 만들어 주기
              objectId = await data.insertedId.toString();

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
                  create_at: madeVote.create_at,
                },
              });
            }
          );
          // FIXME: FORMAT 'open ended'
        } else if (format === "open ended") {
          db.collection("vote").insertOne(
            {
              // user_id,
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
                .collection("vote")
                .findOne({ _id: new ObjectId(objectId) });

              // 응답 보내기
              return res.status(201).json({
                data: {
                  _id: madeVote._id,
                  title: madeVote.title,
                  response: madeVote.response,
                  create_at: madeVote.create_at,
                  url,
                },
              });
            }
          );
          // FIXME: FORMAT 'vs'
        } else if (format === "vs") {
          db.collection("vote").insertOne(
            {
              // user_id,
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
                .collection("vote")
                .findOne({ _id: new ObjectId(objectId) });

              // 응답 보내기
              return res.status(201).json({
                data: {
                  _id: madeVote._id,
                  title: madeVote.title,
                  items: madeVote.items,
                  create_at: madeVote.create_at,
                  url,
                },
              });
            }
          );
          // FIXME: FORMAT 'word cloud'
        } else if (format === "word cloud") {
          db.collection("vote").insertOne(
            {
              // user_id,
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
                .collection("vote")
                .findOne({ _id: new ObjectId(objectId) });

              // 응답 보내기
              return res.status(201).json({
                data: {
                  _id: madeVote._id,
                  title: madeVote.title,
                  items: madeVote.items,
                  create_at: madeVote.create_at,
                  url,
                },
              });
            }
          );
        }
      } catch {
        return res.status(400);
      }
    },
  },

  delete: {
    delete: async (req: Request & { params: any }, res: Response) => {
      const voteId = req.params;

      db.collection("vote").deleteOne(
        { _id: new ObjectId(voteId) },
        async (err: Error, data: any) => {
          return res.status(200).json({ message: "Successfully deleted" });
        }
      );
    },
  },

  undergoing: {
    patch: async (req: Request & { params: any }, res: Response) => {
      const voteId = req.params;

      const isActive = await db
        .collection("vote")
        .findOne({ _id: new ObjectId(voteId) }, (err: Error, data: any) => {
          // undergoing === true => false
          if (data.undergoing === true) {
            db.collection("vote").updateOne(
              { _id: new ObjectId(voteId) },
              { $set: { undergoing: false } },
              async (err: Error, data: any) => {
                return res.status(200).json({ isActive: "false" });
              }
            );
            // undergoing === false => true
          } else {
            db.collection("vote").updateOne(
              { _id: new ObjectId(voteId) },
              { $set: { undergoing: true } },
              async (err: Error, data: any) => {
                return res.status(200).json({ isActive: "true" });
              }
            );
          }
        });
    },
  },
};
