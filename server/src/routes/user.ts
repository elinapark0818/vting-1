import { Router } from "express";

const { controller } = require("../controllers/user");

const router = Router();

router.post("/user", controller.signup.post);
console.log(controller);
// router.get("/auth", controller.userInfo.get);

export default router;
