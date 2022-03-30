"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const session_1 = require("../controllers/session");
const router = (0, express_1.Router)();
router.post("/", session_1.SessionController.signIn.post);
router.get("/", session_1.SessionController.signOut.get);
exports.default = router;
