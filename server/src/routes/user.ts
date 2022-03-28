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
>>>>>>> 6f1ca17a8da061c763774ed0efcbde3b5af2efbf

router.post("/check", UserController.userCheck.post);
router.post("/check", UserController.passwordCheck.post);
router.post("/", UserController.signup.post);
// router.post("/oauth", UserController.oauth.post);
router.delete("/", UserController.resign.delete);
router.get("/:id", UserController.userInfo.get);
router.patch("/:id", UserController.userInfo.patch);

export default router;
