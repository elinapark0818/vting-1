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

  // userInfo: {
  // post: async (req: Request, res: Response) => {
  // console.log(req);
  // const image = req.file.path;
  // console.log(req.file);
  // if (image === undefined) {
  //   return res.status(400).send(util.fail(400, "no image"));
  // }
  // res.status(200).send(util.success(200, "image exists", image));
  //   console.log(req.file);
  //   const image = (req.file as Express.Multer.File).location;
  //   if (image === undefined) {
  //     return res
  //       .status(400)
  //       .send(util.fail(400, "이미지가 존재하지 않습니다."));
  //   }
  //   res.status(200).send(util.success(200, "요청 성공 〰️ ", image));
  // },
  // uploadImages: async (req: Request, res: Response) => {
  //   const image = req.files;
  //   const path = (image as Express.Multer.File[]).map((img) => img.location);
  //   if (image === undefined) {
  //     return res
  //       .status(400)
  //       .send(util.fail(400, "이미지가 존재하지 않습니다."));
  //   }
  //   res.status(200).send(util.success(200, "요청 성공 〰️ ", path));
  // },
  // },
  // },
};
