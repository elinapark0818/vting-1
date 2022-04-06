import { Router } from "express";
import { OauthController } from "../controllers/oauth";

const router = Router();

router.get("/test", OauthController.test.get);
router.post("/signin", OauthController.oauthSignIn.post);
router.post("/signup", OauthController.oauthSignUp.post);
// router.post("/", OauthController.userCheck.post);

export default router;
