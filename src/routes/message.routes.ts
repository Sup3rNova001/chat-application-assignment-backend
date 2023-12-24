// routes/message.routes.ts

import express from 'express';
import { MessageController } from '../controllers/message.controller';
import { securityCheck } from '../middlewares/security.middleware';

const router = express.Router();

router.post('/send', securityCheck, MessageController.sendMessage);
router.get('/get/:roomId', securityCheck, MessageController.getMessages);

export default router;
