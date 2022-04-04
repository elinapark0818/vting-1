"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const multer = require("multer");
const { upload } = require("../.upload");
const image_1 = require("../controllers/image");
router.patch("/:id", upload.single("files"), image_1.ImageController.userInfo.patch);
exports.default = router;
