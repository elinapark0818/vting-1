"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const allvotes_1 = require("../controllers/allvotes");
const router = express_1.Router();
// router.post("/", controller.post);
router.get("/", allvotes_1.allVoteController.get);
exports.default = router;
