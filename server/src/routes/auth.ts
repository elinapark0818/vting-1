import { Router } from "express";
import { AuthController } from "../controllers/auth";

const router = Router();

router.get("/", AuthController.navBar.get);

export default router;
