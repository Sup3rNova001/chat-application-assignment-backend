import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { AuthController } from "../controllers/auth.controller";
const router = Router();

router.post("/register", UserController.create);
router.post("/login", AuthController.login);

export default router;
