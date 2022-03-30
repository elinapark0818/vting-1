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
exports.SessionController = void 0;
const __1 = require("..");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SALT_ROUNDS = 6;
const bcrypt = require("bcrypt");
//평문과 hash 된 password 비교  -> 로그인 기능에 사용하기 좋음.
// bcrypt.compare(
//   plaintextPassword,
//   hash,
//   function (err: Error, res: Response) {
//     if (err) {
//       console.log("bcrypt.compare() error : ", err.message);
//     } else {
//       if (res) {
//         console.log("plaintextPassword === hashedPassword");
//       } else {
//         console.log("plaintextPassword !== hashedPassword");
//       }
//     }
//   }
// );
exports.SessionController = {
    signIn: {
        post: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            // 로그인을 위한 이메일, 패스워드 받기
            const { user_id, password } = yield req.body;
            console.log("잘 들어오고 있는지 확인 ===>", user_id);
            console.log("db들어오는지 확인====>", __1.db);
            try {
                console.log("여기까지는");
                const findUser = yield __1.db
                    .collection("user")
                    .findOne({ user_id: user_id });
                var check = yield bcrypt.compare(password, findUser.password);
                console.log(check);
                if (check) {
                    const accessToken = jsonwebtoken_1.default.sign({ name: user_id }, process.env.ACCESS_SECRET, { expiresIn: "24h" });
                    console.log("token====>", accessToken);
                    return res.status(200).json({
                        data: {
                            _id: findUser._id,
                            user_id: findUser.user_id,
                            nickname: findUser.nickname,
                            image: findUser.image,
                            vote: findUser.vote,
                        },
                        message: "Successfully logged in",
                    });
                }
                else {
                    return res.status(400).json({ message: "Wrong password" });
                }
            }
            catch (err) {
                console.log(err);
                res.status(400).json({ message: "Bad request" });
            }
        }),
    },
    // logout, clear cookie
    signOut: {
        get: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            // function getCookie(name: string) {
            //   let matches = req.headers.cookie.match(
            //     new RegExp(
            //       "(?:^|; )" +
            //         name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
            //         "=([^;]*)"
            //     )
            //   );
            //   return matches ? decodeURIComponent(matches[1]) : undefined;
            // }
            // const accessToken = getCookie("accessToken");
            // console.log("logged out", accessToken);
            // // const accessToken = req.get("accessToken");
            // const user_id = jwt.verify(
            //   accessToken as string,
            //   process.env.ACCESS_SECRET as jwt.Secret
            // );
            function getCookie(name) {
                let matches = req.headers.cookie.match(new RegExp("(?:^|; )" +
                    name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
                    "=([^;]*)"));
                return matches ? decodeURIComponent(matches[1]) : undefined;
            }
            const accessToken = getCookie("accessToken");
            const user_id = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_SECRET);
            try {
                if (user_id) {
                    res.clearCookie("accessToken", { sameSite: "none", secure: true });
                    return res.status(200).json({ message: "Successfully logged out" });
                }
            }
            catch (err) {
                console.log(err);
                return res.status(400).json({ message: "Failed logged out" });
            }
        }),
    },
};
