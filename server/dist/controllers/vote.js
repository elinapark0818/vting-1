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
            let { title, format, manytimes, multiple, type, items, response, password, } = req.body;
            // access code(6-digits) 만들기
            let url = 0;
            while (String(url).length < 6) {
                url = Math.ceil(Math.random() * 1000000);
            }
            if (items !== undefined) {
                // items Array에 count: 0 넣어주기
                if (Array.isArray(items)) {
                    for (let el of items) {
                        el.count = 0;
                    }
                }
                // items 아무것도 안보내줄때 빈객체로 셋팅 해놓기
            }
            else {
                items = [];
            }
            // response 빈객체로 셋팅 해놓기
            response = [];
            // response 아무것도 안보내줄때 빈객체로 셋팅 해놓기
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
                                isPublic: true,
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
                                        isPublic: madeVote.isPublic,
                                        undergoing: madeVote.undergoing,
                                        created_at: madeVote.created_at,
                                        url,
                                    },
                                });
                            }));
                            // FIXME: FORMAT 'open ended'
                        }
                        else if (format === "open") {
                            __1.db.collection("vote").insertOne({
                                user_id: data.user_id,
                                url,
                                title,
                                format,
                                manytimes,
                                response,
                                undergoing: true,
                                isPublic: true,
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
                                        isPublic: madeVote.isPublic,
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
                                isPublic: true,
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
                                        isPublic: madeVote.isPublic,
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
                                isPublic: true,
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
                                        isPublic: madeVote.isPublic,
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
    // FIXME: Show Vote
    // 회원, 비회원 분기해서 보여주기
    show_vote: {
        get: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            // 비밀번호의 유무에 따라 회원 비회원을 나눠서 데이터 보내기(because. 로그인되어있는 사람이 비회원으로 만든 vote의 V page로 가게되는경우 토큰이 있어도 들어 갈 수 있어야 한다)
            // 변경 => 데이터가 저장된 위치가 collection('vote') or collection('non-member') 인지에 따라 분기시켜주기
            try {
                const findMemberVote = yield __1.db
                    .collection("vote")
                    .findOne({ url: Number(req.params.accessCode) });
                if (req.headers.authorization &&
                    req.headers.authorization.split(" ")[0] === "Bearer" &&
                    findMemberVote) {
                    let token = req.headers.authorization.split(" ")[1];
                    jsonwebtoken_1.default.verify(token, process.env.ACCESS_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                        // url(req.params.id)로 vote data 가져오기(회원일때 collection -> vote )
                        let voteId = yield __1.db
                            .collection("vote")
                            .findOne({ url: Number(req.params.accessCode) });
                        voteId = voteId._id;
                        // 해당 vote 찾기
                        yield __1.db
                            .collection("vote")
                            .findOne({ user_id: data.user_id, _id: new mongodb_1.ObjectId(voteId) }, (err, data) => {
                            console.log("data", data);
                            if (data.format !== "open") {
                                let sumCount = 0;
                                for (let el of data.items) {
                                    sumCount += el.count;
                                }
                                return res.status(200).json({ data: data, sumCount });
                            }
                            else {
                                return res.status(200).json({ data: data });
                            }
                        });
                    }));
                    // 비회원 vote data 보내기(클라에서 비번으로 접근 여부 판단함)
                }
                else if (!findMemberVote) {
                    // url(req.params.id)로 vote data 가져오기(회원일때 collection -> non-member )
                    let voteId = yield __1.db
                        .collection("non-member")
                        .findOne({ url: Number(req.params.accessCode) });
                    voteId = voteId._id;
                    // 해당 vote 찾기
                    yield __1.db
                        .collection("non-member")
                        .findOne({ _id: new mongodb_1.ObjectId(voteId) }, (err, data) => {
                        // 남은시간(분) 계산해서 보내주기
                        let overtime = (new Date(data.created_at.toString()).getTime() -
                            new Date().getTime()) /
                            (1000 * 60) +
                            60;
                        overtime = Math.round(overtime);
                        if (data.format !== "open") {
                            let sumCount = 0;
                            for (let el of data.items) {
                                sumCount += el.count;
                            }
                            return res.status(200).json({ data: data, overtime, sumCount });
                        }
                        else {
                            return res.status(200).json({ data: data, overtime });
                        }
                    });
                }
                else {
                    // 로그인이 풀리는 경우(accessToken 만료 됬을때)
                    return res.status(400).json({ message: "Bad Request" });
                }
            }
            catch (_b) {
                return res.status(400).json({ message: "Bad Request" });
            }
        }),
    },
    // FIXME: Delete Vote
    delete: {
        delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            // url(req.params.id)로 vote data 가져오기
            let voteId = yield __1.db
                .collection("vote")
                .findOne({ url: Number(req.params.accessCode) });
            voteId = voteId._id;
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
            catch (_c) {
                return res.status(400).json({ message: "Bad Request" });
            }
        }),
    },
    undergoingAndPublic: {
        patch: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const reqData = req.body;
            const findMemberVote = yield __1.db
                .collection("vote")
                .findOne({ url: Number(req.params.accessCode) });
            try {
                // 회원인 경우 token 확인 후 내 vote를 수정하기
                if (req.headers.authorization &&
                    req.headers.authorization.split(" ")[0] === "Bearer" &&
                    findMemberVote) {
                    let authorization = req.headers.authorization;
                    let token = authorization.split(" ")[1];
                    jsonwebtoken_1.default.verify(token, process.env.ACCESS_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                        // url(req.params.id)로 vote data 가져오기
                        let voteId = yield __1.db
                            .collection("vote")
                            .findOne({ url: Number(req.params.accessCode) });
                        voteId = voteId._id;
                        // 토큰이 확인되면 vote collection에서 해당유저가 만들었던 vote중 요청된 보트가 일치하면 patch 가능
                        yield __1.db
                            .collection("vote")
                            .findOne({ _id: new mongodb_1.ObjectId(voteId), user_id: data.user_id }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                            // undergoing === true => false
                            if (reqData.isActive !== null &&
                                reqData.isPublic === null) {
                                if (data.undergoing === true) {
                                    yield __1.db
                                        .collection("vote")
                                        .updateOne({ _id: new mongodb_1.ObjectId(voteId) }, { $set: { undergoing: false } }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                                        return res.status(200).json({
                                            isActive: false,
                                            isPublic: null,
                                        });
                                    }));
                                    // undergoing === false => true
                                }
                                else if (data.undergoing === false) {
                                    yield __1.db
                                        .collection("vote")
                                        .updateOne({ _id: new mongodb_1.ObjectId(voteId) }, { $set: { undergoing: true } }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                                        return res.status(200).json({
                                            isActive: true,
                                            isPublic: null,
                                        });
                                    }));
                                }
                            }
                            else if (reqData.isActive === null &&
                                reqData.isPublic !== null) {
                                // isPublic = true ===> false
                                if (data.isPublic === true) {
                                    __1.db.collection("vote").updateOne({ _id: new mongodb_1.ObjectId(voteId) }, { $set: { isPublic: false } }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                                        return res
                                            .status(200)
                                            .json({ isActive: null, isPublic: false });
                                    }));
                                    // isPublic = false ===> true
                                }
                                else if (data.isPublic === false) {
                                    __1.db.collection("vote").updateOne({ _id: new mongodb_1.ObjectId(voteId) }, { $set: { isPublic: true } }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                                        return res
                                            .status(200)
                                            .json({ isActive: null, isPublic: true });
                                    }));
                                }
                            }
                        }));
                    }));
                    // 비회원일떄 수정 하기(undergoing만 바꿀 수 있음)
                }
                else if (!findMemberVote) {
                    // url(req.params.id)로 vote data 가져오기
                    let voteId = yield __1.db
                        .collection("non-member")
                        .findOne({ url: Number(req.params.accessCode) });
                    voteId = voteId._id;
                    yield __1.db
                        .collection("non-member")
                        .findOne({ _id: new mongodb_1.ObjectId(voteId) }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                        if (data.undergoing === true) {
                            yield __1.db
                                .collection("non-member")
                                .updateOne({ _id: new mongodb_1.ObjectId(voteId) }, { $set: { undergoing: false } }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                                return res.status(200).json({ isActive: false });
                            }));
                        }
                        else if (data.undergoing === false) {
                            yield __1.db
                                .collection("non-member")
                                .updateOne({ _id: new mongodb_1.ObjectId(voteId) }, { $set: { undergoing: true } }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                                return res.status(200).json({ isActive: true });
                            }));
                        }
                    }));
                }
                else {
                    return res.status(400).json({ message: "Bad Request" });
                }
            }
            catch (_d) {
                return res.status(400).json({ message: "Bad Request" });
            }
        }),
    },
};
