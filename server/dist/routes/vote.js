"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vote_1 = require("../controllers/vote");
const router = (0, express_1.Router)();
// router.post("/", controller.post);
router.get("/test", vote_1.VoteController.test.get);
router.post("/", vote_1.VoteController.create.post);
exports.default = router;
