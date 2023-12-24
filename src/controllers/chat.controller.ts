import { Request, Response, NextFunction } from "express";
import { Chat, ChatDocument } from "../models/chat.model";
import { User } from "../models/user.model";
import { RequestWithUserId } from "../types/express";
import mongoose from "mongoose";
export class ChatController {
  static async createChat(
    request: RequestWithUserId,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { participants } = request.body;
      const userId = new mongoose.Types.ObjectId(request.userId);
      // Create a new chat room in the database
      const newChat: ChatDocument = await Chat.create({
        participants: [...participants, userId],
        messages: [],
      });

      response.status(201).json(newChat);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getChats(
    request: RequestWithUserId,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = request.userId;
      const user = await User.findById(userId).populate({
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
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async joinChat(
    request: RequestWithUserId,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = new mongoose.Types.ObjectId(request.userId); // Assuming you have a userId in the request
      const { roomId } = request.body;

      const chatRoom = await Chat.findById(roomId);

      if (!chatRoom) {
        response.status(404).json({ error: "Chat room not found" });
        return;
      }

      // Check if the user is already a participant in the chat room
      if (!chatRoom.participants.includes(userId)) {
        chatRoom.participants.push(userId);
        await chatRoom.save();
      }

      response.status(200).json(chatRoom);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
}
