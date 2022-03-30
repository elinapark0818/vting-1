"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userSchema = new mongoose_1.default.Schema({
    _id: Schema.Types.ObjectId,
    user_id: {
        type: String,
        required: true,
        trim: true,
        unique: 1,
    },
    nickname: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: false,
    },
    vote: {
        type: Array,
        required: false,
    },
});
const model = mongoose_1.default.model("user", userSchema);
