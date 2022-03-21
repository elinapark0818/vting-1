"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { controller } = require("../controllers/user");
const router = (0, express_1.Router)();
router.post("/user", controller.signup.post);
console.log(controller);
// router.get("/auth", controller.userInfo.get);
exports.default = router;
