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
const __1 = require("..");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcrypt = require("bcrypt");
exports.SessionController = {
    signIn: {
        post: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            // 로그인을 위한 이메일, 패스워드 받기
            const { user_id, password } = req.body;
            try {
                const findUser = yield __1.db
                    .collection("user")
                    .findOne({ user_id: user_id });
                if (findUser) {
                    var check = yield bcrypt.compare(password, findUser.password);
                    if (check) {
                        const accessToken = jsonwebtoken_1.default.sign({ user_id }, process.env.ACCESS_SECRET, { expiresIn: 60 * 60 * 60 });
                        return res.status(200).json({
                            data: {
                                user_data: {
                                    _id: findUser._id,
                                    user_id: findUser.user_id,
                                    nickname: findUser.nickname,
                                    image: findUser.image,
                                    vote: findUser.vote,
                                },
                                accessToken: accessToken,
                            },
                            message: "Successfully logged in",
                        });
                    }
                    else {
                        return res.status(400).json({ message: "Wrong password" });
                    }
                }
                else {
                    return res.status(400).json({ message: "There's no ID" });
                }
            }
            catch (err) {
                console.log(err);
                return res.status(400).json({ message: "Bad request" });
            }
        }),
    },
    // logout, clear cookie
    signOut: {
        get: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            if (req.headers.authorization &&
                req.headers.authorization.split(" ")[0] === "Bearer") {
                let authorization = req.headers.authorization;
                let accessToken = authorization.split(" ")[1];
                try {
                    const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_SECRET, (err) => {
                        return res.status(400);
                    });
                    if (decoded) {
                        return res.status(200).json({
                            data: { accessToken: "" },
                            message: "Successfully logged out",
                        });
                    }
                    else if (decoded === undefined) {
                        return res.status(200);
                    }
                }
                catch (err) {
                    console.log(err);
                    return res.status(400).json({ message: "Failed logged out" });
                }
            }
            else {
                res
                    .status(200)
                    .json({ data: { accessToken: "" }, message: "No token exists" });
            }
        }),
    },
};
