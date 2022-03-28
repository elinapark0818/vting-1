"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const router = (0, express_1.Router)();

// router.post("/", controller.post);
router.post("/check", user_1.UserController.userCheck.post);
router.post("/check", user_1.UserController.passwordCheck.post);
router.post("/", user_1.UserController.signup.post);
// router.post("/oauth", UserController.oauth.post);
router.delete("/", user_1.UserController.resign.delete);
router.get("/:id", user_1.UserController.userInfo.get);
router.patch("/:id", user_1.UserController.userInfo.patch);

exports.default = router;
