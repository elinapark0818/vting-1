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

const PORT = 8070;
const app: express.Application = express();

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello Vting!");
});

// app.use(((err: Error, req: Request, res: Response, next: NextFunction) => {
//   res.status(500).send(err.message);
// }) as ErrorRequestHandler);

// const allowedOrigins = [
//   "http://localhost:3000",
//   "http://v-ting.net",
//   "https://v-ting.net",
// ];

const options: cors.CorsOptions = {
  origin: "https://v-ting.net",
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
  credentials: true,
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

// console.log(process.env.DATABASE_PORT);

MongoClient.connect(
  process.env.DATABASE_URL,
  { useUnifiedTopology: true },
  function (err: Error, database: any) {
    if (err) console.log(err);

    db = database.db("vting_dev");
    console.log("db connected");
  }
);

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
