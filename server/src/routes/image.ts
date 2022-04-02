import { Router } from "express";
const router = Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
import { ImageController } from "../controllers/image";

// const upload = require("../../modules/multer");

router.patch("/:id", upload.single("files"), ImageController.userInfo.patch);

export default router;
