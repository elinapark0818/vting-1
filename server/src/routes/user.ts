import { Router } from "express";
import { UserController } from "../controllers/user";

const router = Router();

// router.post("/", controller.post);

router.post("/check", UserController.signupCheck.post);
router.post("/", UserController.signup.post);
// router.post("/oauth", controller.oauth.post);
// router.delete("/", UserController.resign.delete);

console.log(UserController);

export default router;
