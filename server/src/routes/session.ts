import { Router } from "express";
import { SessionController } from "../controllers/session";

const router = Router();

router.post("/", SessionController.signIn.post);
router.get("/", SessionController.signOut.get);

export default router;
