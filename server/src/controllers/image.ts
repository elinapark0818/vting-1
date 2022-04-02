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
  };
}

export let ImageController = {
  userInfo: {
    patch: async (req: Request, res: Response) => {
      console.log(req.file);

      res.status(200).json({ message: "Success", data: req.file.location });
    },
  },
};
