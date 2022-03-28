import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user";
import sessionRoutes from "./routes/session";
import authRoutes from "./routes/auth";
import cors from "cors";
// import voteRoutes from "./routes/vote";
// import voterRoutes from "./routes/voter";
dotenv.config();

const PORT = 8080;
const app: express.Application = express();

// app.use("/", (req: Request, res: Response, next: NextFunction) => {
//   res.send("Hello world");
// });

app.use(((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send(err.message);
}) as ErrorRequestHandler);

const options: cors.CorsOptions = {
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
app.use(cors(options));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/user", userRoutes);
app.use("/session", sessionRoutes);
app.use("/auth", authRoutes);
// app.use("/vting", voteRoutes);
// app.use("/voter", voterRoutes);

//db 연결 -> 되면 포트 열기
export const MongoClient = require("mongodb").MongoClient;
export var db: any;

MongoClient.connect(
  process.env.DATABASE_URL,
  { useUnifiedTopology: true },
  function (err: Error, database: any) {
    if (err) console.log(err);

    db = database.db("vting_dev");
    console.log("db connected");
    app.listen(PORT, () => console.log(`${PORT} port opened`));
  }
);
