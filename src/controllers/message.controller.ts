import { Request, Response, NextFunction } from "express";
import { RequestWithUserId } from "../types/express";
import { Message, MessageDocument } from "../models/message.model";
import { Chat } from "../models/chat.model";
import mongoose from "mongoose";
import {io} from "./../index";

export class MessageController {
  static async sendMessage(
    request: RequestWithUserId,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { content, roomId } = request.body;
      const senderId = new mongoose.Types.ObjectId(request.userId);

      // Check if the user is a participant in the chat room
      const chatRoom = await Chat.findById(roomId);
      if (!chatRoom || !chatRoom.participants.includes(senderId)) {
        response.status(403).json({
          error: "You are not allowed to send messages in this chat room",
        });
        return;
      }

      const newMessage: MessageDocument = await Message.create({
        sender: senderId,
        content,
      });

      chatRoom.messages.push(newMessage._id);
      chatRoom.latestMessage = newMessage._id;
      await chatRoom.save();

      io.to(roomId).emit("message", newMessage);

      response.status(201).json(newMessage);
    } catch (err) {
      console.error(err);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getMessages(
    request: RequestWithUserId,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { roomId } = request.params;
      const userId = new mongoose.Types.ObjectId(request.userId);
      // Check if the user is a participant in the chat room
      const chatRoom = await Chat.findById(roomId).populate("messages");
      if (!chatRoom || !chatRoom.participants.includes(userId)) {
        response.status(403).json({
          error: "You are not allowed to view messages in this chat room",
        });
        return;
      }

      const messages = chatRoom.messages;

      response.status(200).json(messages);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
}
