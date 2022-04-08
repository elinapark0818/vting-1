import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { db } from "..";
import dotenv from "dotenv";
dotenv.config();
const multer = require("multer");
const multerS3 = require("multer-s3");

interface ImageController {
  userInfo: {
    patch: any;
  };
}

export let ImageController = {
  userInfo: {
    patch: async (req: Request, res: Response) => {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
        let authorization: string | undefined = req.headers.authorization;
        let accessToken: string = authorization.split(" ")[1];

        try {
          const decoded: any = jwt.verify(
            accessToken as string,
            process.env.ACCESS_SECRET as jwt.Secret
          );

          const findUser = await db
            .collection("user")
            .findOne({ user_id: decoded.user_id });

          await db.collection("user").updateOne(
            { user_id: decoded.user_id },
            {
              $set: {
                image:
                  (req.file as Express.MulterS3.File).location ||
                  findUser.image,
              },
            }
          );

          res.status(200).json({
            data: (req.file as Express.MulterS3.File).location,
            message: "Image successfully updated ",
          });
        } catch {
          return res.status(400).json({ message: "Bad request" });
        }
      }
    },
  },
};
