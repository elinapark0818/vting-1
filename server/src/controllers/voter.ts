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
import dotenv from "dotenv";
dotenv.config();

interface PatchVote {
  idx: number;
  content?: string;
}

export let VoterController = {
  // 투표하는 화면 보여주기
  // params access-code 로 받은 url로 어떤 데이터베이스인지 확인하기
  // password 여부에 따라 회원, 비회원 나누기
  // && format별로 보여주는 데이터 다르게? 아니면 그냥 전체 데이터 보내기?
  // 우선필요한 데이터만 보내기
  // 회원인 경우
  // format 'bar', 'word',
  // 보낼 데이터 => nickname(user_id), profile(user data), title, items or response

  test: {
    get: async (req: Request, res: Response) => {
      res.send("voter test!");
    },
  },

  // 유형별 투표하기
  // bar => 해당 idx countup
  vote: {
    patch: async (req: Request & { body: any }, res: Response) => {
      const { idx, content }: PatchVote = req.body;

      try {
        const findMemberVote = await db
          .collection("vote")
          .findOne({ url: Number(req.params.accessCode) });

        // 회원인지 비회원인지, 회원이면 access-code와 확인
        if (
          req.headers.authorization &&
          req.headers.authorization.split(" ")[0] === "Bearer" &&
          findMemberVote
        ) {
          let authorization: string | undefined = req.headers.authorization;
          let token: string = authorization.split(" ")[1];
          jwt.verify(
            token,
            process.env.ACCESS_SECRET as any,
            async (err: Error, data: any) => {
              // format이 'bar', 'versus' 일때
              if (
                findMemberVote.format === "bar" ||
                findMemberVote.format === "versus"
              ) {
                // vote 데이터 upload
                await db.collection("vote").updateOne(
                  {
                    url: Number(req.params.accessCode),
                    "items.idx": idx,
                  },
                  { $inc: { "items.$.count": 1 } }
                );
                return res
                  .status(200)
                  .json({ message: "Successfully reflected" });

                // format이 'open' 일때 => response 추가
              } else if (findMemberVote.format === "open") {
                await db
                  .collection("vote")
                  .updateOne(
                    { url: Number(req.params.accessCode) },
                    { $push: { response: { content: content } } }
                  );

                // format이 'open' 일때 => items에 추가 또는 data가 있을때 items.idx count +1
              } else if (findMemberVote.format === "word") {
                const findEl = await db.collection("vote").findOne({
                  url: Number(req.params.accessCode),
                  response: [content],
                });
                console.log("findEl", findEl);
                // { $indexOfArray: [ [ "a", "abc" ], "a" ] }  =>  0~(idx) 없으면 -1
                // format이 'open', 'word' 일떄
              } else {
              }
            }
          );
          // 비회원 일때
        } else if (!findMemberVote) {
        } else {
          return res.status(400).json({ message: "Bad Request" });
        }
      } catch {
        return res.status(400).json({ message: "Bad Request" });
      }
    },
  },
};
