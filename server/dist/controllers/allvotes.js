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
const __1 = require("..");
exports.allVoteController = {
    get: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const params = req.params.content;
            // FIXME: content type = "newest"
            if (params === "newest") {
                const findAllVotes = yield __1.db
                    .collection("vote")
                    .find({ isPublic: true, undergoing: true })
                    .sort({ created_at: -1 })
                    .limit(20)
                    .toArray();
                return res.status(200).json({
                    vote: findAllVotes,
                });
            }
            // FIXME: content type = "most"
            else if (params === "most") {
                const findAllVotes = yield __1.db
                    .collection("vote")
                    .find({ isPublic: true, undergoing: true })
                    .sort({ voterCount: -1 })
                    .limit(20)
                    .toArray();
                return res.status(200).json({
                    vote: findAllVotes,
                });
            }
            // FIXME: content type = "diff"
            else if (params === "diff") {
                const findAllVotes = yield __1.db
                    .collection("vote")
                    .find({
                    isPublic: true,
                    undergoing: true,
                    format: { $in: ["bar", "word", "versus"] },
                })
                    .sort({ variance: 1 })
                    .limit(20)
                    .toArray();
                return res.status(200).json({
                    vote: findAllVotes,
                });
            }
        }
        catch (_a) {
            return res.status(400).json({ message: "Bad Request" });
        }
    }),
};
