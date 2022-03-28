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
exports.AuthController = void 0;
const __1 = require("..");
const jwt = require("jsonwebtoken");
exports.AuthController = {
    navBar: {
        get: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                const findUser = yield __1.db
                    .collection("user")
                    .findOne({ user_id: user_id });
                return res.status(200).json({
                    data: {
                        _id: findUser._id,
                        user_id: findUser.user_id,
                        nickname: findUser.nickname,
                        image: findUser.image,
                        vote: findUser.vote,
                    },
                });
            }
            catch (err) {
                console.log(err);
                return res.status(400).json({ message: "Bad request" });
            }
        }),
    },
};
