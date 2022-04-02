import { Router } from "express";
import { VoteController } from "../controllers/vote";

const router = Router();

// router.post("/", controller.post);

router.get("/test", VoteController.test.get);
router.post("/", VoteController.create.post);
router.get("/:accessCode", VoteController.show_vote.get);
router.delete("/:accessCode", VoteController.delete.delete);
router.patch("/:accessCode", VoteController.undergoingAndPublic.patch);

export default router;
