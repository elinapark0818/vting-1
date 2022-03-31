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

export let VoterController = {
  test: {
    get: async (req: Request, res: Response) => {
      res.send("voter test!");
    },
  },

  // 유형별 투표하기
  // bar => 해당 idx countup
  vote_page: {
    get: async (req: Request, res: Response) => {
      res.send(req.params);
      // const accessCode = req.params;
      // console.log("accessCode", accessCode);
      // const findVote = await db.collection("vote").findOne({ url: accessCode });
      // if (findVote) {
      //   res.send("ok");
      // }
    },
  },
};
