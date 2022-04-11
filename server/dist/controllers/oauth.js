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
exports.OauthController = {
    test: {
        get: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            res.send("oauth test!");
        }),
    },
    oauthSignIn: {
        post: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            // 로그인을 위한 이메일 받기
            const { user_id } = req.body;
            try {
                const findUser = yield __1.db
                    .collection("user")
                    .findOne({ user_id: user_id });
                if (findUser) {
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
                    return res.status(400).json({ message: "There's no ID" });
                }
            }
            catch (err) {
                return res.status(400).json({ message: "Bad request" });
            }
        }),
    },
    oauthSignUp: {
        // 비밀번호 없이 signup 하기
        post: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const { user_id, nickname, image, provider } = req.body;
            try {
                if (user_id && nickname) {
                    yield __1.db.collection("user").insertOne({
                        user_id,
                        nickname,
                        image,
                        vote: [],
                        provider,
                    }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                        const accessToken = jsonwebtoken_1.default.sign({ user_id }, process.env.ACCESS_SECRET, {
                            expiresIn: 60 * 60 * 60,
                        });
                        let findUserId = yield __1.db.collection("user").findOne({ user_id });
                        return res.status(201).json({
                            data: {
                                user_data: {
                                    _id: findUserId._id,
                                    user_id: findUserId.user_id,
                                    nickname: findUserId.nickname,
                                    image: findUserId.image,
                                    vote: findUserId.vote,
                                },
                                accessToken: accessToken,
                            },
                            message: "Successfully Signed Up",
                        });
                    }));
                }
                else {
                    return res.status(400).json({ message: "Sign up failed" });
                }
            }
            catch (err) {
                console.log(err);
                res.status(400).json({ message: "Sign up failed" });
            }
        }),
    },
};
