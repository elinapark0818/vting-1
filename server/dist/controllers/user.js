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
Object.defineProperty(exports, "__esModule", { value: true });

exports.UserController = void 0;
const __1 = require("..");
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.UserController = {
    //회원가입과 탈퇴시 모두 사용가능한 체크
    userCheck: {
        post: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const user_id = yield req.body;
                const findUser = yield __1.db
                    .collection("user")
                    .findOne({ user_id: req.body.user_id });
                if (!findUser) {
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
                return res.status(400).json({ message: "Bad Request" });
            }
        }),
    },
    //회원정보 수정시 사용가능한 체크
    passwordCheck: {
        post: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            function getCookie(name) {
                let matches = req.headers.cookie.match(new RegExp("(?:^|; )" +
                    name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
                    "=([^;]*)"));
                return matches ? decodeURIComponent(matches[1]) : undefined;
            }
            const accessToken = getCookie("accessToken");
            const user_id = jwt.verify(accessToken, process.env.ACCESS_SECRET);
            console.log("user_id", user_id);
            try {
                const password = yield req.body;
                const findUser = yield __1.db
                    .collection("user")
                    .findOne({ user_id: user_id, password: password });
                if (!findUser) {
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
            catch (err) {
                console.log(err);
                return res.status(400).json({ message: "Bad Request" });
            }
        }),
    },
    signup: {
        post: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            // "user_id" : "test@yof.com",
            // "nickname" : "test",
            // "password" : "1234",
            // "image" : null,
            // "vote" : null,
            const { user_id, nickname, password, image, vote } = req.body;
            try {
                if (user_id && password && nickname) {
                    __1.db.collection("user").insertOne({
                        user_id,
                        nickname,
                        password,
                        image,
                        vote,
                    });
                    // user_id을 playload에 담아 토큰 생성
                    const accessToken = jwt.sign({ name: user_id }, process.env.ACCESS_SECRET, { expiresIn: 60 * 60 });
                    console.log("1", accessToken);
                    // user_id을 playload에 담은 토큰을 쿠키로 전달
                    res.cookie("accessToken", accessToken, {
                        sameSite: "none",
                        secure: true,
                    });
                    let findUserId = yield __1.db
                        .collection("user")
                        .findOne({ user_id: req.body.user_id });
                    console.log(findUserId);
                    return res.status(201).json({
                        user_data: {
                            _id: findUserId._id,
                            user_id: req.body.user_id,
                            nickname: req.body.nickname,
                            image: req.body.image,
                            vote: req.body.vote,
                        },
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
            // FIXME: 만약토큰으로 작업하면 이 부분으로 작업하기
            function getCookie(name) {
                let matches = req.headers.cookie.match(new RegExp("(?:^|; )" +
                    name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
                    "=([^;]*)"));
                return matches ? decodeURIComponent(matches[1]) : undefined;
            }
            const accessToken = getCookie("accessToken");
            const user_id = jwt.verify(accessToken, process.env.ACCESS_SECRET);
            console.log("user_id", user_id);
            try {
                // 유저 정보 삭제하기
                yield __1.db.collection("user").deleteOne({ user_id: user_id });
                // 쿠키에 토큰 삭제하기
                yield res.clearCookie("accessToken", {

                    sameSite: "none",
                    secure: true,
                });
                return res
                    .status(200)
                    .json({ message: "Successfully account deleted" });
            }
            catch (err) {
                console.log(err);
                return res.status(400).json({ message: "Bad request" });
            }
        }),
    },
    userInfo: {
        get: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            function getCookie(name) {
                let matches = String(req.headers.cookie).match(new RegExp("(?:^|; )" +
                    name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
                    "=([^;]*)"));
                console.log(req.headers);
                return matches ? decodeURIComponent(matches[1]) : undefined;
            }
            const accessToken = getCookie("accessToken");
            const user_id = jwt.verify(accessToken, process.env.ACCESS_SECRET);
            console.log("user_id", user_id);
            try {
                const findUser = yield __1.db
                    .collection("user")
                    .findOne({ user_id: user_id } && { _id: req.params.id });
                if (findUser) {
                    return res.status(200).json({
                        user_data: {
                            _id: findUser._id,
                            nickname: findUser.nickname,
                            user_id: findUser.user_id,
                            image: findUser.image,
                            vote: findUser.vote,
                        },
                    });
                }
                else {
                    return res.status(400).json({ message: "Bad request" });
                }
            }
            catch (err) {
                console.log(err);
            }
        }),
        patch: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const { nickname, password, image } = req.body;
            function getCookie(name) {
                let matches = String(req.headers.cookie).match(new RegExp("(?:^|; )" +
                    name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
                    "=([^;]*)"));
                console.log(req.headers);
                return matches ? decodeURIComponent(matches[1]) : undefined;
            }
            const accessToken = getCookie("accessToken");
            const user_id = jwt.verify(accessToken, process.env.ACCESS_SECRET);
            console.log("user_id", user_id);
            try {
                const findUser = yield __1.db
                    .collection("user")
                    .updateOne({ user_id: user_id } && { _id: req.params.id }, {
                    $set: {
                        nickname: req.body.nickname,
                        image: req.body.image,
                        vote: req.body.vote,
                    },
                });
                return res.status(200).json({ message: "Successfully updated" });
            }
            catch (_b) {
                return res.status(400).json({ message: "Bad request" });
            }

        }),
    },

};
