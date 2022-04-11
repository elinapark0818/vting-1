import { Router } from "express";
const router = Router();
const multer = require("multer");
const { upload } = require("../.upload");
import { ImageController } from "../controllers/image";

router.patch("/:id", upload.single("files"), ImageController.userInfo.patch);

export default router;
