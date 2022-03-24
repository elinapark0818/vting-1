import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user";
dotenv.config();

const PORT = process.env.PORT;
const app: express.Application = express();
const cors = require("cors");

app.use(((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send(err.message);
}) as ErrorRequestHandler);

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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", userRoutes);

//db 연결 -> 되면 포트 열기
export const MongoClient = require("mongodb").MongoClient;
export const db: any = {};

MongoClient.connect(
  process.env.DATABASE_URL,
  { useUnifiedTopology: true },
  function (err: any, client: any) {
    if (err) console.log(err);

    db.db = client.db("vting");
    console.log("db connected");
    app.listen(PORT, () => console.log(`${PORT} port opened`));
  }
);
