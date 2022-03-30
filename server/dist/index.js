"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.MongoClient = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("./routes/user"));
const session_1 = __importDefault(require("./routes/session"));
const auth_1 = __importDefault(require("./routes/auth"));
const cors_1 = __importDefault(require("cors"));
const vote_1 = __importDefault(require("./routes/vote"));
const voter_1 = __importDefault(require("./routes/voter"));

dotenv_1.default.config();
const PORT = process.env.PORT;
const app = express_1.default();

const allowedOrigins = ["http://localhost:3000", "v-ting.net"];
const options = {
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    credentials: true,
    maxAge: 24 * 6 * 60 * 10000,
};
app.use((0, cors_1.default)(options));
// app.use(
//   cors({
//     origin: true,
//     methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
//     credentials: true,
//     cookie: {
//       maxAge: 24 * 6 * 60 * 10000,
//       httpOnly: false,
//       secure: true,
//       sameSite: "none",
//     },
//   })
// );
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/user", user_1.default);
app.use("/session", session_1.default);
app.use("/auth", auth_1.default);
app.use("/vting", vote_1.default);
app.use("/voter", voter_1.default);
//db 연결 -> 되면 포트 열기
exports.MongoClient = require("mongodb").MongoClient;
// const url = "mongodb://127.0.0.1:27017";
exports.MongoClient.connect(
// url,
process.env.DATABASE_URL, { useUnifiedTopology: true }, function (err, database) {
    if (err)
        console.log(err);
    exports.db = database.db("vting_dev");
    console.log("db connected");
    app.listen(PORT, () => console.log(`${PORT} port opened`));
});
