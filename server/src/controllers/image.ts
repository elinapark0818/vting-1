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
