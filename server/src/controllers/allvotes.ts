import { db } from "..";
import express, { Request, Response } from "express";

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
      const params: string = req.params.content;

      // FIXME: content type = "newest"
      if (params === "newest") {
        const findAllVotes = await db
          .collection("vote")
          .find({ isPublic: true, undergoing: true })
          .sort({ created_at: -1 })
          .limit(20)
          .toArray();

        return res.status(200).json({
          vote: findAllVotes,
        });
      }

      // FIXME: content type = "most"
      else if (params === "most") {
        const findAllVotes = await db
          .collection("vote")
          .find({ isPublic: true, undergoing: true })
          .sort({ voterCount: -1 })
          .limit(20)
          .toArray();

        return res.status(200).json({
          vote: findAllVotes,
        });
      }

      // FIXME: content type = "diff"
      else if (params === "diff") {
        const findAllVotes = await db
          .collection("vote")
          .find({
            isPublic: true,
            undergoing: true,
            format: { $in: ["bar", "word", "versus"] },
          })
          .sort({ variance: 1 })
          .limit(20)
          .toArray();

        return res.status(200).json({
          vote: findAllVotes,
        });
      }
    } catch {
      return res.status(400).json({ message: "Bad Request" });
    }
  },
};
