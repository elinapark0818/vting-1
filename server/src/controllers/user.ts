import { db } from "..";
import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
const jwt = require("jsonwebtoken");

// export default {
//   post: async (req: Request, res: Response) => {
//     const { email } = req.body;

//     try {
//       if (email) {
//         const accessToken = jwt.sign({ email }, process.env.ACCESS_SECRET, {
//           expiresIn: "10h",
//         });

//         console.log("1", accessToken);

//         // email을 playload에 담은 토큰을 쿠키로 전달

//         res.cookie("accessToken", accessToken, {
//           sameSite: "none",
//         });

//         return res.status(200).send("OK");
//       }
//     } catch {
//       return res.status(400).send("NOT OK");
//     }
//   },
// };

interface UserType {
  user_id: string;
  nickname: string;
  password: string;
  image?: string;
  vote?: string[];
}

interface UserController {
  signupCheck: { post: any };
  signup: { post: any };
}

export let UserController = {
  signupCheck: {
    post: async (
      req: Request & { body: { user_id: string } },
      res: Response
    ) => {
      try {
        // user_id 받아오기
        const user_id = await req.body;
        // user_id data 있는지 확인하기
        const findUser = await db
          .collection("user")
          .findOne({ user_id: user_id });
        if (!findUser) {
          return res.status(200).json({
            data: user_id,
            message: "No match exists. you can make a new ID",
          });
        } else {
          return res.status(204).json({
            data: null,
            message: "Request denied. the same email exists",
          });
        }
      } catch {
        return res.status(400).json({ message: "Bad Request" });
      }
    },
  },

  signup: {
    post: async (req: Request & { body: UserType }, res: Response) => {
      // "user_id" : "test@yof.com",
      // "nickname" : "test",
      // "password" : "1234",
      // "image" : null,
      // "vote" : null,
      const { user_id, nickname, password, image, vote } = req.body;
      console.log(db);
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
            sameSite: "none",
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
      } catch (err) {
        console.log("11111111111111111111111111111", err);
        res.status(400).json({ message: "Sign up failed" });
      }
    },
  },

  // oauth.post,

  // resign: {
  //   delete: async (req: Request, res: Response) => {

  //   },
  // },
};
