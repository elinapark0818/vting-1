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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const __1 = require("..");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const multer = require("multer");
const multerS3 = require("multer-s3");
exports.ImageController = {
    userInfo: {
        patch: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            if (req.headers.authorization &&
                req.headers.authorization.split(" ")[0] === "Bearer") {
                let authorization = req.headers.authorization;
                let accessToken = authorization.split(" ")[1];
                try {
                    const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_SECRET);
                    const findUser = yield __1.db
                        .collection("user")
                        .findOne({ user_id: decoded.user_id });
                    yield __1.db.collection("user").updateOne({ user_id: decoded.user_id }, {
                        $set: {
                            image: req.file.location ||
                                findUser.image,
                        },
                    });
                    res.status(200).json({
                        data: req.file.location,
                        message: "Image successfully updated ",
                    });
                }
                catch (_a) {
                    return res.status(400).json({ message: "Bad request" });
                }
            }
        }),
    },
};
