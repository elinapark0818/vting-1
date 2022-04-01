import { Router } from "express";
const router = Router();
const multer = require("multer");
const upload = multer({ dest: "../../uploads" });
import { ImageController } from "../controllers/image";

// const upload = require("../../modules/multer");

router.post("/", upload.single("image"), ImageController.userInfo.post);

export default router;
