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
const SALT_ROUNDS = 6;
const bcrypt = require("bcrypt");
const multerS3 = require("multer-s3");
exports.UserController = {
    //회원가입과 탈퇴시 모두 사용가능한 체크
    userCheck: {
        post: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { user_id, password } = req.body;
                if (user_id) {
                    const findUserWithId = yield __1.db
                        .collection("user")
                        .findOne({ user_id: user_id });
                    if (!findUserWithId) {
                        return res.status(200).json({
                            message: "It doesn't match",
                        });
                    }
                    else {
                        return res.status(200).json({
                            message: "Success verified",
                        });
                    }
                }
                else if (password) {
                    if (req.headers.authorization &&
                        req.headers.authorization.split(" ")[0] === "Bearer") {
                        let authorization = req.headers.authorization;
                        let accessToken = authorization.split(" ")[1];
                        try {
                            const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_SECRET);
                            const findUserWithPw = yield __1.db
                                .collection("user")
                                .findOne({ user_id: decoded.user_id });
                            var check = yield bcrypt.compare(password, findUserWithPw.password);
                            if (!check) {
                                return res.status(200).json({
                                    message: "It doesn't match",
                                });
                            }
                            else {
                                return res.status(200).json({
                                    message: "Success verified",
                                });
                            }
                        }
                        catch (_a) {
                            res.status(400).json({ message: "Bad Request" });
                        }
                    }
                }
            }
            catch (_b) {
                return res.status(400).json({ message: "Bad Request" });
            }
        }),
    },
    signup: {
        post: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const { user_id, nickname, password } = req.body;
            try {
                if (user_id && password && nickname) {
                    bcrypt.genSalt(SALT_ROUNDS, function (err, salt) {
                        if (err) {
                            console.log("genSalt Error: " + err);
                        }
                        else {
                            bcrypt.hash(password, salt, function (err, hash) {
                                __1.db.collection("user").insertOne({
                                    user_id: req.body.user_id,
                                    nickname: req.body.nickname,
                                    password: hash,
                                    image: "https://vtingimage.s3.ap-northeast-2.amazonaws.com/uploads/yof_logo-17.jpg",
                                    vote: [],
                                }, (err, data) => __awaiter(this, void 0, void 0, function* () {
                                    const accessToken = jsonwebtoken_1.default.sign({ user_id }, process.env.ACCESS_SECRET, {
                                        expiresIn: 60 * 60 * 60,
                                    });
                                    let findUserId = yield __1.db
                                        .collection("user")
                                        .findOne({ user_id: req.body.user_id });
                                    return res.status(201).json({
                                        data: {
                                            user_data: {
                                                _id: findUserId._id,
                                                user_id: req.body.user_id,
                                                nickname: req.body.nickname,
                                                image: "https://vtingimage.s3.ap-northeast-2.amazonaws.com/uploads/yof_logo-17.jpg",
                                                vote: req.body.vote,
                                            },
                                            accessToken: accessToken,
                                        },
                                        message: "Successfully Signed Up",
                                    });
                                }));
                                if (err) {
                                    console.log("bycrpt hash method error : ", err.message);
                                }
                                else {
                                }
                            });
                        }
                    });
                }
                else {
                    return res.status(203).json({
                        data: null,
                        message: "Please fill in all required spaces",
                    });
                }
            }
            catch (err) {
                console.log(err);
                res.status(400).json({ message: "Sign up failed" });
            }
        }),
    },
    // oauth.post,
    resign: {
        delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            if (req.headers.authorization &&
                req.headers.authorization.split(" ")[0] === "Bearer") {
                let authorization = req.headers.authorization;
                let accessToken = authorization.split(" ")[1];
                try {
                    const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_SECRET);
                    // 보트 전부 삭제하고 유저 삭제하기
                    yield __1.db.collection("vote").deleteMany({ user_id: decoded.user_id });
                    yield __1.db.collection("user").deleteOne({ user_id: decoded.user_id });
                    // 쿠키에 토큰 삭제하기
                    return res.status(200).json({
                        data: { accessToken: "" },
                        message: "Successfully account deleted",
                    });
                }
                catch (err) {
                    console.log(err);
                    return res.status(400).json({ message: "Bad request" });
                }
            }
        }),
    },
    userInfo: {
        get: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            if (req.headers.authorization &&
                req.headers.authorization.split(" ")[0] === "Bearer") {
                let authorization = req.headers.authorization;
                let accessToken = authorization.split(" ")[1];
                try {
                    const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_SECRET);
                    if (decoded && !req.query.q) {
                        const findUser = yield __1.db
                            .collection("user")
                            .findOne({ user_id: decoded.user_id });
                        const countUserVote = yield __1.db
                            .collection("vote")
                            .find({ user_id: decoded.user_id })
                            .count();
                        return res.status(200).json({
                            data: {
                                _id: findUser._id,
                                nickname: findUser.nickname,
                                user_id: findUser.user_id,
                                image: findUser.image,
                                voteCount: countUserVote,
                                provider: findUser.provider,
                            },
                        });
                    }
                    else if (req.query) {
                        var q = req.query.q;
                        const findUserVote = yield __1.db
                            .collection("vote")
                            .find({ user_id: decoded.user_id })
                            .toArray();
                        var voteInfo = [];
                        const countUserVote = yield __1.db
                            .collection("vote")
                            .find({ user_id: decoded.user_id })
                            .count();
                        // countUserVote가 예를 들면 32이면
                        // q=4 일때 0~1까지 q=3일때 2~11까지 q=2일때 12~21(20뺀거~11뺀거)까지 q=1일때 22~31(10뺀거~1뺀거)
                        // countUserVote가 예를 들면 15이면
                        //  q=2일때 0~4(20뺀거~11뺀거)까지 q=1일때 5~14(10뺀거~1뺀거)
                        for (let i = countUserVote - 10 * q; i <= countUserVote - 10 * q + 9; i++) {
                            if (findUserVote[i] === undefined)
                                continue;
                            const vote = {
                                title: findUserVote[i].title,
                                format: findUserVote[i].format,
                                isPublic: findUserVote[i].isPublic,
                                undergoing: findUserVote[i].undergoing,
                                created_at: findUserVote[i].created_at,
                                url: findUserVote[i].url,
                            };
                            voteInfo.push(vote);
                        }
                        const reverseVote = voteInfo.reverse();
                        return res.status(200).json({
                            vote: reverseVote,
                        });
                    }
                    else {
                        return res.status(400).json({ message: "Bad request" });
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
        }),
        patch: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const { nickname, password } = req.body;
            if (req.headers.authorization &&
                req.headers.authorization.split(" ")[0] === "Bearer") {
                let authorization = req.headers.authorization;
                let accessToken = authorization.split(" ")[1];
                try {
                    const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_SECRET);
                    const findUser = yield __1.db
                        .collection("user")
                        .findOne({ user_id: decoded.user_id });
                    yield bcrypt.genSalt(SALT_ROUNDS, function (err, salt) {
                        if (err) {
                            console.log("genSalt Error: " + err);
                        }
                        else {
                            bcrypt.hash(req.body.password, salt, function (err, hash) {
                                __1.db.collection("user").updateOne({ user_id: decoded.user_id }, {
                                    $set: {
                                        nickname: req.body.nickname || findUser.nickname,
                                        password: hash || findUser.password,
                                    },
                                });
                                return res
                                    .status(200)
                                    .json({ message: "Successfully updated" });
                            });
                        }
                    });
                }
                catch (_c) {
                    res.status(400).json({ message: "Bad request" });
                }
            }
            else {
                res.status(400).json({ message: "No token exists" });
            }
        }),
    },
};
