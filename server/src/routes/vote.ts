import { Router } from "express";
import { VoteController } from "../controllers/vote";

const router = Router();

// router.post("/", controller.post);

router.get("/test", VoteController.test.get);
router.post("/", VoteController.create.post);
router.delete("/:id", VoteController.delete.delete);
router.patch("/:id", VoteController.undergoingAndPublic.patch);

export default router;
