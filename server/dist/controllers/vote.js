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
            const { title, format, manytimes, multiple, type, items, response, } = req.body;
            // access code(6-digits) 만들기
            let randomNum = Math.random();
            let url = randomNum.toFixed(6) * 1000000;
            //TODO: 마지막 자리가 0이면 다섯자리만 나옴.. 지금.. 아니면 6자리.
            // user_id 가져오기 (from accessToken)
            // const token = res.header;
            // const accessToken: any = token.accessToken.split(" ")[1];
            // const { user_id } = jwt.verify(accessToken, process.env.ACCESS_SECRET);
            try {
                // format에 따라 vote 데이터 DB 저장하기
                // FIXME: FORMAT 'bar'
                if (format === "bar") {
                    let objectId;
                    __1.db.collection("vote").insertOne({
                        // user_id,
                        url,
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
                        objectId = yield data.insertedId.toString();
                        let madeVote = yield __1.db
                            .collection("vote")
                            .findOne({ _id: new mongodb_1.ObjectId(objectId) });
                        // 응답 보내기
                        return res.status(201).json({
                            data: {
                                _id: madeVote._id,
                                title: madeVote.title,
                                items: madeVote.items,
                                url,
                                create_at: madeVote.create_at,
                            },
                        });
                    }));
                    // FIXME: FORMAT 'open ended'
                }
                else if (format === "open ended") {
                    __1.db.collection("vote").insertOne({
                        // user_id,
                        url,
                        title,
                        format,
                        manytimes,
                        response,
                        undergoing: true,
                        created_at: new Date(),
                    }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                        // 방금 만든 objectId 보내주기
                        let objectId = yield data.insertedId.toString();
                        let madeVote = yield __1.db
                            .collection("vote")
                            .findOne({ _id: new mongodb_1.ObjectId(objectId) });
                        // 응답 보내기
                        return res.status(201).json({
                            data: {
                                _id: madeVote._id,
                                title: madeVote.title,
                                response: madeVote.response,
                                create_at: madeVote.create_at,
                                url,
                            },
                        });
                    }));
                    // FIXME: FORMAT 'vs'
                }
                else if (format === "vs") {
                    __1.db.collection("vote").insertOne({
                        // user_id,
                        url,
                        title,
                        format,
                        manytimes,
                        items,
                        undergoing: true,
                        created_at: new Date(),
                    }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                        // 방금 만든 objectId 보내주기
                        let objectId = yield data.insertedId.toString();
                        let madeVote = yield __1.db
                            .collection("vote")
                            .findOne({ _id: new mongodb_1.ObjectId(objectId) });
                        // 응답 보내기
                        return res.status(201).json({
                            data: {
                                _id: madeVote._id,
                                title: madeVote.title,
                                items: madeVote.items,
                                create_at: madeVote.create_at,
                                url,
                            },
                        });
                    }));
                    // FIXME: FORMAT 'word cloud'
                }
                else if (format === "word cloud") {
                    __1.db.collection("vote").insertOne({
                        // user_id,
                        url,
                        title,
                        format,
                        manytimes,
                        items,
                        undergoing: true,
                        created_at: new Date(),
                    }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                        // 방금 만든 objectId 보내주기
                        let objectId = yield data.insertedId.toString();
                        let madeVote = yield __1.db
                            .collection("vote")
                            .findOne({ _id: new mongodb_1.ObjectId(objectId) });
                        // 응답 보내기
                        return res.status(201).json({
                            data: {
                                _id: madeVote._id,
                                title: madeVote.title,
                                items: madeVote.items,
                                create_at: madeVote.create_at,
                                url,
                            },
                        });
                    }));
                }
            }
            catch (_a) {
                return res.status(400);
            }
        }),
    },
    delete: {
        delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const voteId = req.params;
            __1.db.collection("vote").deleteOne({ _id: new mongodb_1.ObjectId(voteId) }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                return res.status(200).json({ message: "Successfully deleted" });
            }));
        }),
    },
    undergoing: {
        patch: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const voteId = req.params;
            const isActive = yield __1.db
                .collection("vote")
                .findOne({ _id: new mongodb_1.ObjectId(voteId) }, (err, data) => {
                // undergoing === true => false
                if (data.undergoing === true) {
                    __1.db.collection("vote").updateOne({ _id: new mongodb_1.ObjectId(voteId) }, { $set: { undergoing: false } }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                        return res.status(200).json({ isActive: "false" });
                    }));
                    // undergoing === false => true
                }
                else {
                    __1.db.collection("vote").updateOne({ _id: new mongodb_1.ObjectId(voteId) }, { $set: { undergoing: true } }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                        return res.status(200).json({ isActive: "true" });
                    }));
                }
            });
        }),
    },
};
