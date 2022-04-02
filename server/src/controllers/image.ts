import { db } from "..";
import jwt from "jsonwebtoken";
const util = require("../../modules/util");
import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import dotenv from "dotenv";
dotenv.config();
const multer = require("multer");

interface ImageController {
  userInfo: {
    patch: any;
    // uploadImages: any
  };
}

export let ImageController = {
  userInfo: {
    patch: async (req: Request, res: Response) => {
      console.log(req.file);

      res.status(200).json({ message: "요청 성공 〰️ ", data: req.file.path });
    },
  },
};
