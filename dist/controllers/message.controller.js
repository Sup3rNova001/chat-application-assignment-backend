"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const message_model_1 = require("../models/message.model");
const chat_model_1 = require("../models/chat.model");
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("./../index");
class MessageController {
    static sendMessage(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { content, roomId } = request.body;
                const senderId = new mongoose_1.default.Types.ObjectId(request.userId);
                // Check if the user is a participant in the chat room
                const chatRoom = yield chat_model_1.Chat.findById(roomId);
                if (!chatRoom || !chatRoom.participants.includes(senderId)) {
                    response.status(403).json({
                        error: "You are not allowed to send messages in this chat room",
                    });
                    return;
                }
                const newMessage = yield message_model_1.Message.create({
                    sender: senderId,
                    content,
                });
                chatRoom.messages.push(newMessage._id);
                chatRoom.latestMessage = newMessage._id;
                yield chatRoom.save();
                index_1.io.to(roomId).emit("message", newMessage);
                response.status(201).json(newMessage);
            }
            catch (err) {
                console.error(err);
                response.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    static getMessages(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { roomId } = request.params;
                const userId = new mongoose_1.default.Types.ObjectId(request.userId);
                // Check if the user is a participant in the chat room
                const chatRoom = yield chat_model_1.Chat.findById(roomId).populate("messages");
                if (!chatRoom || !chatRoom.participants.includes(userId)) {
                    response.status(403).json({
                        error: "You are not allowed to view messages in this chat room",
                    });
                    return;
                }
                const messages = chatRoom.messages;
                response.status(200).json(messages);
            }
            catch (error) {
                console.error(error);
                response.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
}
exports.MessageController = MessageController;
