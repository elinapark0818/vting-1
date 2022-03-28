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
exports.VoteController = void 0;
const __1 = require("..");
const mongodb_1 = require("mongodb");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");
// interface VoteType2 {
//   title: string;
//   format: string;
//   manytimes: string;
//   multiple?: string;
//   type?: string[];
//   items?: { idx: number; content: string; count: number }[];
//   undergoing: true;
// }
exports.VoteController = {
    test: {
        get: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            QRCode.toString("www.daum.net", 
            // { type: "terminal" },
            function (err, url) {
                console.log(url);
                res.send(url);
            });
        }),
    },
    create: {
        post: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            // req.body
            const { title, format, manytimes, multiple, type, items } = req.body;
            // access code(6-digits) 만들기
            let randomNum = Math.random();
            let url = (randomNum.toFixed(6) * 1000000).toString();
            // user_id 가져오기 (from accessToken)
            const token = res.header;
            // const accessToken: any = token.accessToken.split(" ")[1];
            // const { user_id } = jwt.verify(accessToken, process.env.ACCESS_SECRET);
            try {
                // format에 따라 vote 데이터 DB 저장하기
                // BAR formet
                if (format === "bar") {
                    __1.db.collection("vote").insertOne({
                        user_id,
                        title,
                        format,
                        type,
                        items,
                        multiple,
                        manytimes,
                        undergoing: true,
                        create_at: new Date(),
                    }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                        // random url(6digit) 만들어 주기
                        let objectId = data.insertedId.toString();
                        // 응답 보내기
                        return res.status(201).json({
                            data: {
                                _id: new mongodb_1.ObjectId(objectId),
                                url: url,
                                createdAt: new Date(),
                                title,
                                items,
                            },
                        });
                    }));
                }
                else if (format === "open ended") {
                    __1.db.collection("vote").insertOne({
                        user_id,
                        url: "string",
                        title: "코딩 왜 배우나요 길게 써주세요 제발",
                        format: "open ended",
                        manytimes: true,
                        responses: [{ idx: 1, content: "ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ" }],
                        undergoing: true,
                        createdAt: new Date(),
                    });
                }
            }
            catch (_a) {
                return res.status(400);
            }
        }),
    },
};
