import { db } from "..";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

interface AnswerVoteType {
  title: string;
  format: string;
  created_at: string;
  url: string;
  sumCount: number;
}

export let allVoteController = {
  get: async (req: Request, res: Response) => {
    try {
      const findAllVotes = await db
        .collection("vote")
        .find({ isPublic: true, undergoing: true })
        .limit(20)
        .toArray();

      const voteInfo = [];

      for (let vote of findAllVotes) {
        console.log(vote);
        if (
          vote.format === "bar" ||
          vote.format === "versus" ||
          vote.format === "word"
        ) {
          let result = 0;
          if (vote.items && vote.items.count) {
            for (let item of vote.items) {
              result += item.count;
            }
          } else {
            result = 0;
          }
          const voteType1: AnswerVoteType = {
            title: vote.title,
            format: vote.format,
            created_at: vote.created_at,
            url: vote.url,
            sumCount: result,
          };
          voteInfo.push(voteType1);
        } else if (vote.format === "open") {
          let result = 0;
          if (vote.response) {
            result = vote.response.length;
          }
          const voteType2: AnswerVoteType = {
            title: vote.title,
            format: vote.format,
            created_at: vote.created_at,
            url: vote.url,
            sumCount: result,
          };
          voteInfo.push(voteType2);
        }
      }

      return res.status(200).json({
        vote: voteInfo,
      });
    } catch {
      return res.status(400).json({ message: "Bad Request" });
    }
  },
};
