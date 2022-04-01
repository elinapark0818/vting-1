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
        get: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            __1.db.collection("non-member").insertOne({
                test: true,
                created_at: new Date(),
            });
            res.send("vote test!!");
        }),
    },
    create: {
        post: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const { title, format, manytimes, multiple, type, items, response, password, } = req.body;
            // access code(6-digits) 만들기
            let randomNum = Math.random();
            let url = randomNum.toFixed(6) * 1000000;
            try {
                // 헤더에 token 받아오기
                let userId;
                if (req.headers.authorization &&
                    req.headers.authorization.split(" ")[0] === "Bearer" &&
                    !password) {
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
                                status: "public",
                                created_at: new Date(),
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
                                        status: madeVote.status,
                                        undergoing: madeVote.undergoing,
                                        created_at: madeVote.created_at,
                                    },
                                });
                            }));
                            // FIXME: FORMAT 'open ended'
                        }
                        else if (format === "open") {
                            console.log("open ended start");
                            __1.db.collection("vote").insertOne({
                                user_id: data.user_id,
                                url,
                                title,
                                format,
                                manytimes,
                                response,
                                undergoing: true,
                                status: "public",
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
                                        status: madeVote.status,
                                        undergoing: madeVote.undergoing,
                                        created_at: madeVote.created_at,
                                        url,
                                    },
                                });
                            }));
                            // FIXME: FORMAT 'vs'
                        }
                        else if (format === "versus") {
                            __1.db.collection("vote").insertOne({
                                user_id: data.user_id,
                                url,
                                title,
                                format,
                                manytimes,
                                items,
                                undergoing: true,
                                status: "public",
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
                                        status: madeVote.status,
                                        undergoing: madeVote.undergoing,
                                        created_at: madeVote.created_at,
                                        url,
                                    },
                                });
                            }));
                            // FIXME: FORMAT 'word cloud'
                        }
                        else if (format === "word") {
                            __1.db.collection("vote").insertOne({
                                user_id: data.user_id,
                                url,
                                title,
                                format,
                                manytimes,
                                items,
                                undergoing: true,
                                status: "public",
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
                                        status: madeVote.status,
                                        undergoing: madeVote.undergoing,
                                        created_at: madeVote.created_at,
                                        url,
                                    },
                                });
                            }));
                        }
                    }));
                }
                else if (password) {
                    // TODO: 비회원 일때 생성 관련된 응답 만들기!
                    // TODO: non-member collection에 데이터 넣기(1시간후 자동 삭제됨)
                    // TODO: 유저아이디 X, 유저데이터에 넣기 X, 임시비번 저장하기, 임시비번으로 분기 해서 실행시키기
                    // TODO: timeover date 추가하기 (남은시간 = 생성시간 - 현재시간 > 0)
                    // format에 따라 vote 데이터 DB 저장하기
                    // FIXME: FORMAT 'bar'
                    if (format === "bar") {
                        let objectId;
                        yield __1.db.collection("non-member").insertOne({
                            password,
                            url,
                            title,
                            format,
                            type,
                            items,
                            multiple,
                            manytimes,
                            undergoing: true,
                            created_at: new Date(),
                        }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                            // random url(6digit) 만들어 주기
                            objectId = yield data.insertedId.toString();
                            // 만들어진 투표 => 골라서 응답 보내주기
                            let madeVote = yield __1.db
                                .collection("non-member")
                                .findOne({ _id: new mongodb_1.ObjectId(objectId) });
                            // 남은시간(분) 계산해서 보내주기
                            let overtime = (new Date(madeVote.created_at.toString()).getTime() -
                                new Date().getTime()) /
                                (1000 * 60) +
                                60;
                            overtime = Math.round(overtime);
                            // 응답 보내기
                            return res.status(201).json({
                                data: {
                                    _id: madeVote._id,
                                    title: madeVote.title,
                                    items: madeVote.items,
                                    url,
                                    created_at: madeVote.created_at,
                                    undergoing: madeVote.undergoing,
                                    overtime,
                                },
                            });
                        }));
                        // FIXME: FORMAT 'open ended'
                    }
                    else if (format === "open") {
                        __1.db.collection("non-member").insertOne({
                            password,
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
                                .collection("non-member")
                                .findOne({ _id: new mongodb_1.ObjectId(objectId) });
                            // 남은시간(분) 계산해서 보내주기
                            let overtime = (new Date(madeVote.created_at.toString()).getTime() -
                                new Date().getTime()) /
                                (1000 * 60) +
                                60;
                            overtime = Math.round(overtime);
                            // 응답 보내기
                            return res.status(201).json({
                                data: {
                                    _id: madeVote._id,
                                    title: madeVote.title,
                                    response: madeVote.response,
                                    url,
                                    created_at: madeVote.created_at,
                                    undergoing: madeVote.undergoing,
                                    overtime,
                                },
                            });
                        }));
                        // FIXME: FORMAT 'vs'
                    }
                    else if (format === "versus") {
                        __1.db.collection("non-member").insertOne({
                            password,
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
                                .collection("non-member")
                                .findOne({ _id: new mongodb_1.ObjectId(objectId) });
                            // 남은시간(분) 계산해서 보내주기
                            let overtime = (new Date(madeVote.created_at.toString()).getTime() -
                                new Date().getTime()) /
                                (1000 * 60) +
                                60;
                            overtime = Math.round(overtime);
                            // 응답 보내기
                            return res.status(201).json({
                                data: {
                                    _id: madeVote._id,
                                    title: madeVote.title,
                                    items: madeVote.items,
                                    url,
                                    created_at: madeVote.created_at,
                                    undergoing: madeVote.undergoing,
                                    overtime,
                                },
                            });
                        }));
                        // FIXME: FORMAT 'word cloud'
                    }
                    else if (format === "word") {
                        __1.db.collection("non-member").insertOne({
                            password,
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
                                .collection("non-member")
                                .findOne({ _id: new mongodb_1.ObjectId(objectId) });
                            // 남은시간(분) 계산해서 보내주기
                            let overtime = (new Date(madeVote.created_at.toString()).getTime() -
                                new Date().getTime()) /
                                (1000 * 60) +
                                60;
                            overtime = Math.round(overtime);
                            // 응답 보내기
                            return res.status(201).json({
                                data: {
                                    _id: madeVote._id,
                                    title: madeVote.title,
                                    items: madeVote.items,
                                    url,
                                    created_at: madeVote.created_at,
                                    undergoing: madeVote.undergoing,
                                    overtime,
                                },
                            });
                        }));
                    }
                }
            }
            catch (_a) {
                return res.status(400);
            }
        }),
    },
    delete: {
        delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const voteId = req.params.id;
            try {
                //TODO: user data에 해당 vote(배열로 되어있음) 삭제해야됨
                // 만약 유저가 여러가지 vote를 만들었다면 vote삭제시 user의 vote array에서 해당 vote를 삭제해야 된다.
                if (req.headers.authorization &&
                    req.headers.authorization.split(" ")[0] === "Bearer") {
                    let authorization = req.headers.authorization;
                    let token = authorization.split(" ")[1];
                    jsonwebtoken_1.default.verify(token, process.env.ACCESS_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                        // user collection에서 vote array 데이터 중 일부 데이터 삭제하기($pull)
                        yield __1.db
                            .collection("user")
                            .updateOne({ user_id: data.user_id }, { $pull: { vote: new mongodb_1.ObjectId(voteId) } });
                        // user vote 삭제 후 vote data 삭제
                        yield __1.db
                            .collection("vote")
                            .deleteOne({ _id: new mongodb_1.ObjectId(voteId) }, () => __awaiter(void 0, void 0, void 0, function* () {
                            return res
                                .status(200)
                                .json({ message: "Successfully deleted" });
                        }));
                    }));
                }
            }
            catch (_b) {
                return res.status(400).json({ message: "Bad Request" });
            }
        }),
    },
    undergoingAndPublic: {
        patch: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const voteId = req.params;
            const reqData = req.body;
            try {
                // 회원인 경우 token 확인 후 내 vote를 수정하기
                if (req.headers.authorization &&
                    req.headers.authorization.split(" ")[0] === "Bearer") {
                    let authorization = req.headers.authorization;
                    let token = authorization.split(" ")[1];
                    jsonwebtoken_1.default.verify(token, process.env.ACCESS_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                        // 토큰이 확인되면 vote collection에서 해당유저가 만들었던 vote중 요청된 보트가 일치하면 patch 가능
                        yield __1.db
                            .collection("vote")
                            .findOne({ _id: new mongodb_1.ObjectId(voteId), user_id: data.user_id }, (err, data) => {
                            // undergoing === true => false
                            console.log("reqData", req.body);
                            if (reqData.isActive !== null && reqData.status === null) {
                                if (reqData.isActive) {
                                    __1.db.collection("vote").updateOne({ _id: new mongodb_1.ObjectId(voteId) }, { $set: { undergoing: true } }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                                        return res.status(200).json({ isActive: true });
                                    }));
                                }
                                else {
                                    __1.db.collection("vote").updateOne({ _id: new mongodb_1.ObjectId(voteId) }, { $set: { undergoing: false } }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                                        return res.status(200).json({ isActive: false });
                                    }));
                                }
                            }
                            else if (reqData.isActive === null &&
                                reqData.status !== null) {
                                if (reqData.status === "public") {
                                    __1.db.collection("vote").updateOne({ _id: new mongodb_1.ObjectId(voteId) }, { $set: { undergoing: "public" } }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                                        return res
                                            .status(200)
                                            .json({ undergoing: "public" });
                                    }));
                                }
                                else {
                                    __1.db.collection("vote").updateOne({ _id: new mongodb_1.ObjectId(voteId) }, { $set: { undergoing: "private" } }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                                        return res
                                            .status(200)
                                            .json({ undergoing: "private" });
                                    }));
                                }
                            }
                        });
                    }));
                    // 비회원일떄 수정 하기(undergoing만 바꿀 수 있음)
                }
                else {
                    if (reqData.undergoing === true) {
                        __1.db.collection("vote").updateOne({ _id: new mongodb_1.ObjectId(voteId) }, { $set: { undergoing: true } }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                            return res.status(200).json({ isActive: true });
                        }));
                    }
                    else {
                        __1.db.collection("vote").updateOne({ _id: new mongodb_1.ObjectId(voteId) }, { $set: { undergoing: false } }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                            return res.status(200).json({ isActive: false });
                        }));
                    }
                }
            }
            catch (_c) {
                return res.status(400).json({ message: "Bad Request" });
            }
        }),
    },
};
