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
  undergoing: true;
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
      const { title, format, manytimes, multiple, type, items }: VoteType1 =
        req.body;

      // access code(6-digits) 만들기
      let randomNum: any = Math.random();
      let url: string = (randomNum.toFixed(6) * 1000000).toString();

      // user_id 가져오기 (from accessToken)
      const token: any = req.headers.cookie.accessToken;
      const user_id = jwt.verify(token, process.env.ACCESS_SECRET);

      try {
        // format에 따라 vote 데이터 DB 저장하기
        // BAR formet
        if (format === "bar") {
          db.collection("vote").insertOne(
            {
              user_id,
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
              let objectId: string = data.insertedId.toString();

              // 응답 보내기
              return res.status(201).json({
                data: {
                  _id: new ObjectId(objectId),
                  url: url,
                  createdAt: new Date(),
                  title,
                  items,
                },
              });
            }
          );
        } else if (format === "open ended") {
          db.collection("vote").insertOne({
            user_id,
            url: "string",
            title: "코딩 왜 배우나요 길게 써주세요 제발",
            format: "open ended",
            manytimes: true,
            responses: [{ idx: 1, content: "ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ" }],
            undergoing: true,
            createdAt: new Date(),
          });
        }
      } catch {
        return res.status(400);
      }
    },
  },
};
