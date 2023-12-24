import { Router } from "express";
const router = Router();
import { UserController } from "../controllers/user.controller";

router.post("/create", UserController.create);
router.get("/getOne/:_id", UserController.getOne);
router.get("/getAll", UserController.getAll);
router.put("/update/:_id", UserController.update);
router.delete("/delete/:_id", UserController.delete);

export default router;
