"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("./routes/user"));
dotenv_1.default.config();
const PORT = 80;
const app = express_1.default();
const cors = require("cors");
// app.use("/", (req: Request, res: Response, next: NextFunction) => {
//   res.send("Hello world");
// });
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
});
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    credentials: true,
    cookie: {
      maxAge: 24 * 6 * 60 * 10000,
      httpOnly: false,
      secure: true,
      sameSite: "none",
    },
  })
);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/", user_1.default);
//db 연결 -> 되면 포트 열기
exports.MongoClient = require("mongodb").MongoClient;
exports.db = {};
exports.MongoClient.connect(
  "mongodb+srv://admin:dudqls12@cluster0.pldtu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useUnifiedTopology: true },
  function (err, client) {
    if (err) console.log(err);
    exports.db.db = client.db("vting");
    console.log("db connected");
    app.listen(PORT, () => console.log(`${PORT} port opened`));
  }
);
