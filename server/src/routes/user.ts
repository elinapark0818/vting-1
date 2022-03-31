import { Router } from "express";
const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
import { UserController } from "../controllers/user";

const router = Router();

// router.post("/", controller.post);

router.post("/check", UserController.userCheck.post);
router.post("/", UserController.signup.post);
// router.post("/oauth", UserController.oauth.post);
router.delete("/", UserController.resign.delete);
router.get("/:id", UserController.userInfo.get);
router.patch("/:id", UserController.userInfo.patch);

export default router;
