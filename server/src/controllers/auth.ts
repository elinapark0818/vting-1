import { db } from "..";
import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
const jwt = require("jsonwebtoken");

interface AuthController {
  navBar: { get: any };
}

export let AuthController = {
  navBar: {
    get: async (req: Request, res: Response) => {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
        let authorization: string | undefined = req.headers.authorization;
        let token: string = authorization.split(" ")[1];

        const decoded = jwt.verify(token as string, process.env.ACCESS_SECRET);

        try {
          const findUser = await db
            .collection("user")
            .findOne({ user_id: decoded.user_id });

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
      }
    },
  },
};
