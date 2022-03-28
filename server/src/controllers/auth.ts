import { db } from "..";
import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import { request } from "http";
const jwt = require("jsonwebtoken");

interface AuthController {
  navBar: { get: any };
}

export let AuthController = {
  navBar: {
    get: async (req: Request, res: Response) => {
      function getCookie(name: string) {
        let matches = (req.headers.cookie as string).match(
          new RegExp(
            "(?:^|; )" +
              name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
              "=([^;]*)"
          )
        );
        return matches ? decodeURIComponent(matches[1]) : undefined;
      }
      const accessToken = getCookie("accessToken");
      const user_id = jwt.verify(accessToken, process.env.ACCESS_SECRET);

      console.log("user_id", user_id);

      try {
        const findUser = await db
          .collection("user")
          .findOne({ user_id: user_id });

        return res.status(200).json({
          data: {
            _id: findUser._id,
            user_id: findUser.user_id,
            nickname: findUser.nickname,
            image: findUser.image,
            vote: findUser.vote,
          },
        });
      } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Bad request" });
      }
    },
  },
};
