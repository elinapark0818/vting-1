import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user";
import sessionRoutes from "./routes/session";
import authRoutes from "./routes/auth";
import voteRoutes from "./routes/vote";
import voterRoutes from "./routes/voter";
import imageRoutes from "./routes/image";
import allvotesRoutes from "./routes/allvotes";
import oauthRoutes from "./routes/oauth";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT;
const app: express.Application = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://vote.localhost:3000",
  "v-ting.net",
];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
  credentials: true,
  maxAge: 24 * 6 * 60 * 10000,
};
app.use(cors(options));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/user", userRoutes);
app.use("/session", sessionRoutes);
app.use("/auth", authRoutes);
app.use("/vting", voteRoutes);
app.use("/voter", voterRoutes);
app.use("/image", imageRoutes);
app.use("/allvotes", allvotesRoutes);
app.use("/oauth", oauthRoutes);

//db 연결 -> 되면 포트 열기
export const MongoClient = require("mongodb").MongoClient;
export var db: any;
// const url = "mongodb://127.0.0.1:27017";

MongoClient.connect(
  // url,
  process.env.DATABASE_URL,
  { useUnifiedTopology: true },
  function (err: Error, database: any) {
    if (err) console.log(err);

    db = database.db("vting_dev");
    console.log("db connected");
    app.listen(PORT, () => console.log(`${PORT} port opened`));
  }
);
