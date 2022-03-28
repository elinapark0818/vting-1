"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const router = express_1.Router();
<<<<<<< HEAD
router.post("/", user_1.controller.post);
router.get("/", user_1.controller.get);
// router.post("/user", controller.signup.post);
// router.get("/auth", controller.userInfo.get);
=======
// router.post("/", controller.post);
router.post("/check", user_1.UserController.userCheck.post);
router.post("/check", user_1.UserController.passwordCheck.post);
router.post("/", user_1.UserController.signup.post);
// router.post("/oauth", UserController.oauth.post);
router.delete("/", user_1.UserController.resign.delete);
router.get("/:id", user_1.UserController.userInfo.get);
router.patch("/:id", user_1.UserController.userInfo.patch);
>>>>>>> d4a5ad5481d9863327e1b9fc06e172b3da6b873f
exports.default = router;
