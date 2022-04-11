import { db } from "..";
import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
const jwt = require("jsonwebtoken");
import dotenv from "dotenv";
dotenv.config();

interface PatchVote {
  idx?: number[];
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

  show_vote: {
    get: async (req: Request, res: Response) => {
      try {
        const memberVoteData = await db
          .collection("vote")
          .findOne({ url: Number(req.params.accessCode) });

        if (memberVoteData) {
          const userData = await db
            .collection("user")
            .findOne({ user_id: memberVoteData.user_id });

          return res
            .status(200)
            .json({ vote_data: memberVoteData, user_data: userData });
        } else if (!memberVoteData) {
          const nonmemberVoteData = await db
            .collection("non-member")
            .findOne({ url: Number(req.params.accessCode) });

          // 남은시간(분) 계산해서 보내주기
          let overtime =
            (new Date(nonmemberVoteData.created_at.toString()).getTime() -
              new Date().getTime()) /
              (1000 * 60) +
            60;
          overtime = Math.round(overtime);

          return res
            .status(200)
            .json({ vote_data: nonmemberVoteData, overtime });
        } else {
          return res.status(400).json({ message: "Bad Request" });
        }
      } catch {
        return res.status(400).json({ message: "Bad Request" });
      }
    },
  },

  // FIXME: 유형별 투표하기
  // bar => 해당 idx countup
  vote: {
    patch: async (req: Request & { body: any }, res: Response) => {
      let { idx, content }: PatchVote = req.body;

      let viewContent = "";
      if (content) {
        for (let el of content) {
          if (el === " ") {
            continue;
          } else {
            viewContent += el.toLowerCase();
          }
        }
      }

      try {
        const findMemberVote = await db
          .collection("vote")
          .findOne({ url: Number(req.params.accessCode) });

        // 회원인지 비회원인지 확인
        if (findMemberVote !== null) {
          // format이 'bar', 'versus' 일때
          if (
            findMemberVote.format === "bar" ||
            findMemberVote.format === "versus"
          ) {
            if (idx) {
              for (let el of idx) {
                // vote 데이터 upload
                await db.collection("vote").updateOne(
                  {
                    url: Number(req.params.accessCode),
                    "items.idx": el,
                  },
                  { $inc: { "items.$.count": 1 } }
                );
              }
            }

            // sumCount update
            const updatedMemberVote = await db
              .collection("vote")
              .findOne({ url: Number(req.params.accessCode) });

            let sumCount = 0;
            for (let el of updatedMemberVote.items) {
              sumCount += el.count;
            }
            await db
              .collection("vote")
              .updateOne(
                { url: Number(req.params.accessCode) },
                { $set: { sumCount } }
              );

            // voterCount update +1
            await db
              .collection("vote")
              .updateOne(
                { url: Number(req.params.accessCode) },
                { $inc: { voterCount: 1 } }
              );

            // variance update
            let total = 0;
            for (let el of findMemberVote.items) {
              total += el.count;
            }
            let average = total / findMemberVote.items.length;

            total = 0;

            for (let i = 0; i < findMemberVote.items.length; i++) {
              let deviation = findMemberVote.items[i].count - average;

              total += deviation * deviation;
            }
            let variance = total / (findMemberVote.items.length - 1);

            await db
              .collection("vote")
              .updateOne(
                { url: Number(req.params.accessCode) },
                { $set: { variance } }
              );

            return res.status(200).json({ message: "Successfully reflected" });

            // FIXME: format이 'open' 일때 => response 추가
            // 현재 갖고있는 response의 갯수를 기반으로 idx가 작성됨
            // 만약, 댓글 삭제 기능을 구현하게 되면 idx 작성 방식이 바뀌어야 한다.
          } else if (findMemberVote.format === "open") {
            await db.collection("vote").updateOne(
              { url: Number(req.params.accessCode) },
              {
                $push: {
                  response: {
                    idx: findMemberVote.response.length,
                    content,
                  },
                },
              }
            );

            // voterCount update +1
            await db
              .collection("vote")
              .updateOne(
                { url: Number(req.params.accessCode) },
                { $inc: { voterCount: 1 } }
              );

            return res.status(200).json({ message: "Successfully reflected" });

            // FIXME: format이 'word' 일때 => items에 추가 또는 data가 있을때 items.idx count +1
          } else if (findMemberVote.format === "word") {
            const findContent = await db.collection("vote").findOne({
              url: Number(req.params.accessCode),
              "items.content": viewContent,
            });

            // 작성된 content와 동일한 content가 있을때 => count up
            if (findContent) {
              await db.collection("vote").updateOne(
                {
                  url: Number(req.params.accessCode),
                  "items.content": viewContent,
                },
                { $inc: { "items.$.count": 1 } }
              );

              // sumCount update
              const updatedMemberVote = await db
                .collection("vote")
                .findOne({ url: Number(req.params.accessCode) });

              let sumCount = 0;
              for (let el of updatedMemberVote.items) {
                sumCount += el.count;
              }
              await db
                .collection("vote")
                .updateOne(
                  { url: Number(req.params.accessCode) },
                  { $set: { sumCount } }
                );

              // voterCount update +1
              await db
                .collection("vote")
                .updateOne(
                  { url: Number(req.params.accessCode) },
                  { $inc: { voterCount: 1 } }
                );

              // variance update
              let total = 0;
              for (let el of findMemberVote.items) {
                total += el.count;
              }
              let average = total / findMemberVote.items.length;

              total = 0;

              for (let i = 0; i < findMemberVote.items.length; i++) {
                let deviation = findMemberVote.items[i].count - average;

                total += deviation * deviation;
              }
              let variance = total / (findMemberVote.items.length - 1);

              await db
                .collection("vote")
                .updateOne(
                  { url: Number(req.params.accessCode) },
                  { $set: { variance } }
                );

              return res
                .status(200)
                .json({ message: "Successfully reflected" });
              // format: 'open'작성된 content와 동일한 content가 없을때 => push content
            } else {
              await db.collection("vote").updateOne(
                { url: Number(req.params.accessCode) },
                {
                  $push: {
                    items: {
                      idx: findMemberVote.items.length,
                      content: viewContent,
                      count: 1,
                    },
                  },
                }
              );

              // voterCount update +1
              await db
                .collection("vote")
                .updateOne(
                  { url: Number(req.params.accessCode) },
                  { $inc: { voterCount: 1 } }
                );

              const updatedVote = await db
                .collection("vote")
                .findOne({ url: Number(req.params.accessCode) });

              // variance update
              let total = 0;
              for (let el of updatedVote.items) {
                total += el.count;
              }
              let average = total / updatedVote.items.length;

              total = 0;

              for (let i = 0; i < updatedVote.items.length; i++) {
                let deviation = updatedVote.items[i].count - average;

                total += deviation * deviation;
              }
              let variance = total / (updatedVote.items.length - 1);

              await db
                .collection("vote")
                .updateOne(
                  { url: Number(req.params.accessCode) },
                  { $set: { variance } }
                );

              return res
                .status(200)
                .json({ message: "Successfully reflected" });
            }
          } else {
            return res.status(400).json({ message: "Bad Request" });
          }

          // FIXME: 비회원 일때
        } else if (findMemberVote === null) {
          const findNonMemberVote = await db
            .collection("non-member")
            .findOne({ url: Number(req.params.accessCode) });

          // FIXME: format이 'bar', 'versus' 일때
          if (
            findNonMemberVote.format === "bar" ||
            findNonMemberVote.format === "versus"
          ) {
            // vote 데이터 upload
            // idx가 잘못들어도 updateOne에서 오류가 안생기고 넘어감.....
            if (idx) {
              for (let el of idx) {
                // vote 데이터 upload
                await db.collection("non-member").updateOne(
                  {
                    url: Number(req.params.accessCode),
                    "items.idx": el,
                  },
                  { $inc: { "items.$.count": 1 } }
                );
              }
            }

            // sumCount update
            const updatedNonMemberVote = await db
              .collection("non-member")
              .findOne({ url: Number(req.params.accessCode) });

            let sumCount = 0;
            for (let el of updatedNonMemberVote.items) {
              sumCount += el.count;
            }
            await db
              .collection("non-member")
              .updateOne(
                { url: Number(req.params.accessCode) },
                { $set: { sumCount } }
              );

            return res.status(200).json({ message: "Successfully reflected" });

            // format이 'open' 일때 => response 추가
            // 현재 갖고있는 response의 갯수를 기반으로 idx가 작성됨
            // 만약, 댓글 삭제 기능을 구현하게 되면 idx 작성 방식이 바뀌어야 한다.
          } else if (findNonMemberVote.format === "open") {
            await db.collection("non-member").updateOne(
              { url: Number(req.params.accessCode) },
              {
                $push: {
                  response: {
                    idx: findNonMemberVote.response.length,
                    content,
                  },
                },
              }
            );

            return res.status(200).json({ message: "Successfully reflected" });

            // format이 'open' 일때 => items에 추가 또는 data가 있을때 items.idx count +1
          } else if (findNonMemberVote.format === "word") {
            const findContent = await db.collection("non-member").findOne({
              url: Number(req.params.accessCode),
              "items.content": viewContent,
            });

            // 작성된 content와 동일한 content가 있을때 => count up
            if (findContent) {
              await db.collection("non-member").updateOne(
                {
                  url: Number(req.params.accessCode),
                  "items.content": viewContent,
                },
                { $inc: { "items.$.count": 1 } }
              );

              // sumCount update
              const updatedNonMemberVote = await db
                .collection("non-member")
                .findOne({ url: Number(req.params.accessCode) });

              let sumCount = 0;
              for (let el of updatedNonMemberVote.items) {
                sumCount += el.count;
              }
              await db
                .collection("non-member")
                .updateOne(
                  { url: Number(req.params.accessCode) },
                  { $set: { sumCount } }
                );

              return res
                .status(200)
                .json({ message: "Successfully reflected" });
              // 작성된 content와 동일한 content가 없을때 => push content
            } else {
              await db.collection("non-member").updateOne(
                { url: Number(req.params.accessCode) },
                {
                  $push: {
                    items: {
                      idx: findNonMemberVote.items.length,
                      content: viewContent,
                      count: 1,
                    },
                  },
                }
              );

              return res
                .status(200)
                .json({ message: "Successfully reflected" });
            }
          } else {
            return res.status(400).json({ message: "Bad Request" });
          }
        } else {
          return res.status(400).json({ message: "Bad Request" });
        }
      } catch {
        return res.status(400).json({ message: "Bad Request" });
      }
    },
  },
};
