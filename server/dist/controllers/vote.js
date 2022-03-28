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
            console.log("start post");
            const { title, format, manytimes, multiple, type, items } = req.body;
            try {
                // vote 데이터 DB 저장하기
                __1.db.collection("vote").insertOne({ title, format, manytimes, multiple, type, items }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                    // random url(6digit) 만들어 주기
                    let objectId = data.insertedId.toString();
                    let randomNum = Math.random();
                    let url = (randomNum.toFixed(6) * 1000000).toString();
                    // QRCode 만들어 주기
                    // 응답 보내기
                    return res.status(201).json({
                        vote_data: {
                            _id: new mongodb_1.ObjectId(objectId),
                            url,
                            QRcode: "string",
                            createdAt: new Date(),
                        },
                        vote_details: {
                            title: "점심메뉴를 골라주세요",
                            items: [
                                { idx: 1, content: "짜장면", count: 3 },
                                { idx: 2, content: "짬뽕", count: 4 },
                            ],
                        },
                    });
                }));
            }
            catch (_a) {
                return res.status(400);
            }
        }),
    },
};
