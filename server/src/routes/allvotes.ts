import { Router } from "express";
import { allVoteController } from "../controllers/allvotes";

const router = Router();

// router.post("/", controller.post);

router.get("/:content", allVoteController.get);

export default router;
