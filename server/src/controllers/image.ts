import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
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
      console.log(req.file);

      res
        .status(200)
        .json({
          message: "Success",
          data: (req.file as Express.MulterS3.File).location,
        });
    },
  },
};
