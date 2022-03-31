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
const mongodb_1 = require("mongodb");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.VoteController = {
    test: {
        get: (req, res) => __awaiter(void 0, void 0, void 0, function* () { }),
    },
    create: {
        post: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const { title, format, manytimes, multiple, type, items, response, } = req.body;
            // access code(6-digits) 만들기
            let randomNum = Math.random();
            let url = randomNum.toFixed(6) * 1000000;
            try {
                // 헤더에 token 받아오기
                let userId;
                if (req.headers.authorization &&
                    req.headers.authorization.split(" ")[0] === "Bearer") {
                    let authorization = req.headers.authorization;
                    let token = authorization.split(" ")[1];
                    jsonwebtoken_1.default.verify(token, process.env.ACCESS_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                        // user_id 변수 설정
                        userId = data.user_id;
                        // format에 따라 vote 데이터 DB 저장하기
                        // FIXME: FORMAT 'bar'
                        if (format === "bar") {
                            let objectId;
                            yield __1.db.collection("vote").insertOne({
                                user_id: data.user_id,
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
                                // 유저 데이터에 vote 넣어주기
                                yield __1.db
                                    .collection("user")
                                    .updateOne({ user_id: userId }, { $push: { vote: new mongodb_1.ObjectId(objectId) } });
                                // 만들어진 투표 => 골라서 응답 보내주기
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
                                user_id: data.user_id,
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
                                // 유저 데이터에 vote 넣어주기
                                yield __1.db
                                    .collection("user")
                                    .updateOne({ user_id: userId }, { $push: { vote: new mongodb_1.ObjectId(objectId) } });
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
                                user_id: data.user_id,
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
                                // 유저 데이터에 vote 넣어주기
                                yield __1.db
                                    .collection("user")
                                    .updateOne({ user_id: userId }, { $push: { vote: new mongodb_1.ObjectId(objectId) } });
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
                                user_id: data.user_id,
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
                                // 유저 데이터에 vote 넣어주기
                                yield __1.db
                                    .collection("user")
                                    .updateOne({ user_id: userId }, { $push: { vote: new mongodb_1.ObjectId(objectId) } });
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
                    }));
                }
                else {
                    //TODO: 비회원 일때 생성 관련된 응답 만들기!
                    // 모든 보트 만들수있게? 아니면 특정 보트만 만들수 있게?
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
            try {
                //TODO: user data에 해당 vote(배열로 되어있음) 삭제해야됨
                // 만약 유저가 여러가지 vote를 만들었다면 vote삭제시 user의 vote array에서 해당 vote를 삭제해야 된다.
                let userId;
                if (req.headers.authorization &&
                    req.headers.authorization.split(" ")[0] === "Bearer") {
                    let authorization = req.headers.authorization;
                    let token = authorization.split(" ")[1];
                    jsonwebtoken_1.default.verify(token, process.env.ACCESS_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                        let findUser = yield __1.db
                            .collection("user")
                            .findOne({ user_id: data.user_id }, (err, data) => {
                            console.log("findUserData", data);
                        });
                        console.log("findUser", findUser);
                    }));
                }
                // db.collection("vote").deleteOne(
                //   { _id: new ObjectId(voteId) },
                //   async (err: Error, data: any) => {
                //     return res.status(200).json({ message: "Successfully deleted" });
                //   }
                // );
            }
            catch (_b) {
                return res.status(400).json({ message: "Bad Request" });
            }
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
