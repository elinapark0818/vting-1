"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("../../modules/util");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const multer = require("multer");
exports.ImageController = {
    userInfo: {
        patch: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            // console.log(req);
            console.log(req);
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
        }),
    },
};
