import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";
import { securityCheck } from "../middlewares/security.middleware";
const router = Router();

router.get("/", securityCheck, ChatController.getChats);
router.post("/join", securityCheck, ChatController.joinChat);
router.post("/create", securityCheck, ChatController.createChat);

export default router;
