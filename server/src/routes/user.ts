import { Router } from "express";
import { controller } from "../controllers/user";

const router = Router();

router.post("/", controller.post);
router.get("/", controller.get);

// router.post("/user", controller.signup.post);
// router.get("/auth", controller.userInfo.get);

export default router;
