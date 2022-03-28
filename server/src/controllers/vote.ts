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

interface VoteType {
  title: string;
  format: string;
  manytimes: string;
  multiple?: string;
  type?: string[];
  items?: { idx: number; content: string; count: number }[];
}

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
    post: async (req: Request & { body: VoteType }, res: Response) => {
      console.log("start post");
      const { title, format, manytimes, multiple, type, items } = req.body;

      try {
        // vote 데이터 DB 저장하기
        db.collection("vote").insertOne(
          { title, format, manytimes, multiple, type, items },
          async (err: Error, data: any) => {
            // random url(6digit) 만들어 주기
            let objectId: string = data.insertedId.toString();
            let randomNum: any = Math.random();
            let url: string = (randomNum.toFixed(6) * 1000000).toString();

            // QRCode 만들어 주기

            // 응답 보내기
            return res.status(201).json({
              vote_data: {
                _id: new ObjectId(objectId),
                url,
                QRcode: "string",
                createdAt: new Date(),
              },

              vote_details: {
                title: "점심메뉴를 골라주세요",
                items: [
                  { idx: 1, content: "짜장면", count: 3 },
                  { idx: 2, content: "짬뽕", count: 4 },
                ],
              },
            });
          }
        );
      } catch {
        return res.status(400);
      }
    },
  },
};
