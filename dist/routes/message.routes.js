"use strict";
// routes/message.routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("../controllers/message.controller");
const security_middleware_1 = require("../middlewares/security.middleware");
const router = express_1.default.Router();
router.post('/send', security_middleware_1.securityCheck, message_controller_1.MessageController.sendMessage);
router.get('/get/:roomId', security_middleware_1.securityCheck, message_controller_1.MessageController.getMessages);
exports.default = router;
