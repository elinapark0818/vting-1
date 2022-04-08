"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.allVoteController = {
  get: (req, res) =>
    __awaiter(void 0, void 0, void 0, function* () {
      try {
        const findAllVotes = yield __1.db
          .collection("vote")
          .find({ isPublic: true, undergoing: true })
          .sort({ _id: -1 })
          .limit(20)
          .toArray();
        const voteInfo = [];
        for (let vote of findAllVotes) {
          console.log(vote);
          if (
            vote.format === "bar" ||
            vote.format === "versus" ||
            vote.format === "word"
          ) {
            let result = 0;
            if (vote.items && vote.items.count) {
              for (let item of vote.items) {
                result += item.count;
              }
            } else {
              result = 0;
            }
            const voteType1 = {
              title: vote.title,
              format: vote.format,
              created_at: vote.created_at,
              url: vote.url,
              sumCount: result,
            };
            voteInfo.push(voteType1);
          } else if (vote.format === "open") {
            let result = 0;
            if (vote.response) {
              result = vote.response.length;
            }
            const voteType2 = {
              title: vote.title,
              format: vote.format,
              created_at: vote.created_at,
              url: vote.url,
              sumCount: result,
            };
            voteInfo.push(voteType2);
          }
        }
        return res.status(200).json({
          vote: voteInfo,
        });
      } catch (_a) {
        return res.status(400).json({ message: "Bad Request" });
      }
    }),
};
