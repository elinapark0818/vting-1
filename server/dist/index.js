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
// import voteRoutes from "./routes/vote";
// import voterRoutes from "./routes/voter";
dotenv_1.default.config();
const PORT = 8080;
const app = (0, express_1.default)();
// app.use("/", (req: Request, res: Response, next: NextFunction) => {
//   res.send("Hello world");
// });
// app.use(((err: Error, req: Request, res: Response, next: NextFunction) => {
//   res.status(500).send(err.message);
// }) as ErrorRequestHandler);
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
    origin: "https://v-ting.net",
    preflightContinue: false,
};
app.use((0, cors_1.default)(options));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/user", user_1.default);
app.use("/session", session_1.default);
app.use("/auth", auth_1.default);
// app.use("/vting", voteRoutes);
// app.use("/voter", voterRoutes);
//db 연결 -> 되면 포트 열기
exports.MongoClient = require("mongodb").MongoClient;
exports.MongoClient.connect(process.env.DATABASE_URL, { useUnifiedTopology: true }, function (err, database) {
    if (err)
        console.log(err);
    exports.db = database.db("vting_dev");
    console.log("db connected");
    app.listen(PORT, () => console.log(`${PORT} port opened`));
});
