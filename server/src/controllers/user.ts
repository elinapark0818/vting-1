import { db } from "..";
import { RequestHandler } from "express";
const jwt = require("jsonwebtoken");

interface UserType {
  user_id: string;
  nickname: string;
  password: string;
  image: string;
  vote: string[];
}

export default {
  signup: {
    post: async (req: Request & { body: UserType }, res: Response) => {
      // "user_id" : "test@yof.com",
      // "nickname" : "test",
      // "password" : "1234",
      // "image" : null,
      // "vote" : null,
      const { user_id, nickname, password, image, vote } = req.body;
      console.log(req.body);
      try {
        // default로 필요한 데이터 받아왔는지 확인 하여 데이터 DB에 넣어주기
        if (user_id && password && nickname) {
          // 새로운 유저에 대한 데이터 추가 in db
          db.collection("user").insertOne({
            user_id,
            nickname,
            password,
            image,
            vote,
          });
          // user_id을 playload에 담아 토큰 생성
          const accessToken = jwt.sign({ user_id }, process.env.ACCESS_SECRET, {
            expiresIn: "10h",
          });
          console.log("1", accessToken);
          // user_id을 playload에 담은 토큰을 쿠키로 전달
          res.cookie("accessToken", accessToken, {
            sameSite: "None",
          });
          return res
            .status(201)
            .json({ data: req.body, message: "Successfully created" });
        } else {
          return res.status(203).json({
            data: null,
            message: "Please fill in all required spaces",
          });
        }
      } catch {
        return res.status(400).json({ message: "Bad request" });
      }
    },
  },

  //   userInfo: {
  //     get: async (req: any, res: any) => {
  //       function getCookie(name: any) {
  //         let matches = req.headers.cookie.match(
  //           new RegExp(
  //             "(?:^|; )" +
  //               name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
  //               "=([^;]*)"
  //           )
  //         );
  //         return matches ? decodeURIComponent(matches[1]) : undefined;
  //       }

  //       const accessToken = getCookie("accessToken");

  //       const { user_id } = jwt.verify(accessToken, process.env.ACCESS_SECRET);

  //       try {
  //         if (user_id) {
  //           const userInfo = await db
  //             .collection("user")
  //             .findOne({ user_id: user_id });
  //           if (!userInfo) {
  //             return res.status(203).json({ message: "Bad request" });
  //           } else {
  //             return res.status(200).json({
  //               data: userInfo,
  //               message: "Success. you can get your informations",
  //             });
  //           }
  //         }
  //       } catch {
  //         return res.status(400).json({ message: "Bad request" });
  //       }
  //     },
  //   },
};
