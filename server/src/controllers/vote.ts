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
      let url: string = (randomNum.toFixed(7) * 1000000).toString();

      // user_id 가져오기 (from accessToken)
      // const token = res.header;
      // const accessToken: any = token.accessToken.split(" ")[1];
      // const { user_id } = jwt.verify(accessToken, process.env.ACCESS_SECRET);

      try {
        // format에 따라 vote 데이터 DB 저장하기
        // BAR formet
        if (format === "bar") {
          let objectId: string;
          db.collection("vote").insertOne(
            {
              // user_id,
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
                  create_at: madeVote.create_at,
                  url,
                },
              });
            }
          );
        } else if (format === "open ended") {
          console.log(format);
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
              let madeVote = db
                .collection("vote")
                .findOne({ _id: new ObjectId(objectId) });
              console.log(madeVote);

              // 응답 보내기
              return res.status(201).json({
                data: {
                  _id: new ObjectId(objectId),
                  url,
                  title,
                  response,
                  created_at: new Date(),
                },
              });
            }
          );
        } else if (format === "vs") {
          // _id : ObjectId(''),
          // user_id : ObjectId(''),
          // url : 'string',
          // title : '엄마가 좋아 아빠가 좋아',
          // format : 'vs',
          // items : [{idx : 1, content : '엄마', count : 0},
          //         {idx : 2, content : '아빠', count : 0}],
          // multiple : true,
          // manytimes : false,
          // undergoing : true,
          // createdAt : new Date(),
        }
      } catch {
        return res.status(400);
      }
    },
  },
};
