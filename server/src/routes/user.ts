import { Router } from "express";
<<<<<<< HEAD
import { controller } from "../controllers/user";

const router = Router();

router.post("/", controller.post);
router.get("/", controller.get);
=======
import { UserController } from "../controllers/user";

const router = Router();

// router.post("/", controller.post);
>>>>>>> d4a5ad5481d9863327e1b9fc06e172b3da6b873f

router.post("/check", UserController.userCheck.post);
router.post("/check", UserController.passwordCheck.post);
router.post("/", UserController.signup.post);
// router.post("/oauth", UserController.oauth.post);
router.delete("/", UserController.resign.delete);
router.get("/:id", UserController.userInfo.get);
router.patch("/:id", UserController.userInfo.patch);

export default router;
