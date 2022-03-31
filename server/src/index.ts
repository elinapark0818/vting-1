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
import voteRoutes from "./routes/vote";
import voterRoutes from "./routes/voter";
import cors from "cors";
import jwt from "jsonwebtoken";
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

const allowedOrigins = [
  "http://localhost:3000",
  "http://v-ting.net",
  "https://v-ting.net",
];

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
  origin: allowedOrigins,
  preflightContinue: false,
};
app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

interface UserType {
  user_id: string;
  password: string;
}

app.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const { user_id, password }: UserType = await req.body;
  try {
    const accessToken = jwt.sign(
      { name: user_id },
      process.env.ACCESS_SECRET as jwt.Secret,
      { expiresIn: "24h" }
    );

    console.log("token====>", accessToken);

    // user_id을 playload에 담은 토큰을 쿠키로 전달
    res
      .cookie("accessToken", accessToken, {
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json({ message: "good!" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Bad request" });
  }
});
app.use("/user", userRoutes);
app.use("/session", sessionRoutes);
app.use("/auth", authRoutes);
app.use("/vting", voteRoutes);
app.use("/voter", voterRoutes);

//db 연결 -> 되면 포트 열기
export const MongoClient = require("mongodb").MongoClient;
export var db: any;
// const url = "mongodb://127.0.0.1:27017";

// console.log(process.env.DATABASE_PORT);

MongoClient.connect(
  // url,
  "mongodb+srv://admin:dudqls12@cluster0.pldtu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
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
