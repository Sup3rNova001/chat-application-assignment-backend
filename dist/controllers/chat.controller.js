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
exports.ChatController = void 0;
const chat_model_1 = require("../models/chat.model");
const user_model_1 = require("../models/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
class ChatController {
    static createChat(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { participants } = request.body;
                const userId = new mongoose_1.default.Types.ObjectId(request.userId);
                // Create a new chat room in the database
                const newChat = yield chat_model_1.Chat.create({
                    participants: [...participants, userId],
                    messages: [],
                });
                response.status(201).json(newChat);
            }
            catch (error) {
                console.error(error);
                response.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    static getChats(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = request.userId;
                const user = yield user_model_1.User.findById(userId).populate({
                    path: "chatRooms",
                    populate: [
                        { path: "latestMessage", model: "Message" },
                        { path: "participants", model: "User" },
                    ],
                });
                if (!user) {
                    response.status(404).json({ error: "User not found" });
                    return;
                }
                response.status(200).json(user.chatRooms);
            }
            catch (error) {
                console.error(error);
                response.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    static joinChat(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = new mongoose_1.default.Types.ObjectId(request.userId); // Assuming you have a userId in the request
                const { roomId } = request.body;
                const chatRoom = yield chat_model_1.Chat.findById(roomId);
                if (!chatRoom) {
                    response.status(404).json({ error: "Chat room not found" });
                    return;
                }
                // Check if the user is already a participant in the chat room
                if (!chatRoom.participants.includes(userId)) {
                    chatRoom.participants.push(userId);
                    yield chatRoom.save();
                }
                response.status(200).json(chatRoom);
            }
            catch (error) {
                console.error(error);
                response.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
}
exports.ChatController = ChatController;
