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
exports.db = exports.MongoClient = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("./routes/user"));
const session_1 = __importDefault(require("./routes/session"));
const auth_1 = __importDefault(require("./routes/auth"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import voteRoutes from "./routes/vote";
// import voterRoutes from "./routes/voter";
dotenv_1.default.config();
const PORT = 8070;
const app = (0, express_1.default)();
app.get("/", (req, res, next) => {
    res.send("Hello Vting!");
});
// app.use(((err: Error, req: Request, res: Response, next: NextFunction) => {
//   res.status(500).send(err.message);
// }) as ErrorRequestHandler);
const allowedOrigins = [
    "http://localhost:3000",
    "http://v-ting.net",
    "https://v-ting.net",
];
const options = {
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "X-Access-Token",
    ],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: allowedOrigins,
    preflightContinue: false,
};
app.use((0, cors_1.default)(options));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, password } = yield req.body;
    try {
        const accessToken = jsonwebtoken_1.default.sign({ name: user_id }, process.env.ACCESS_SECRET, { expiresIn: "24h" });
        console.log("token====>", accessToken);
        // user_id을 playload에 담은 토큰을 쿠키로 전달
        res.cookie("accessToken", accessToken, {
            sameSite: "none",
            secure: true,
        });
        res.status(200).json({ message: "good!" });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Bad request" });
    }
    res.send("Hello Vting!");
}));
app.use("/user", user_1.default);
app.use("/session", session_1.default);
app.use("/auth", auth_1.default);
// app.use("/vting", voteRoutes);
// app.use("/voter", voterRoutes);
//db 연결 -> 되면 포트 열기
exports.MongoClient = require("mongodb").MongoClient;
// console.log(process.env.DATABASE_PORT);
exports.MongoClient.connect("mongodb+srv://admin:dudqls12@cluster0.pldtu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useUnifiedTopology: true }, function (err, database) {
    if (err)
        console.log(err);
    exports.db = database.db("vting_dev");
    console.log("db connected");
});
app
    .listen(PORT, () => {
    console.log(`
    ################################################
    🛡️  Server listening on port: ${PORT} 🛡️
    ################################################
  `);
})
    .on("error", (err) => {
    console.error(err);
    process.exit(1);
});
