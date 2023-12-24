import mongoose from "mongoose";
import { Model, model, Schema, Document } from "mongoose";

export interface Chat {
  participants: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
  latestMessage?: mongoose.Types.ObjectId;
}

export interface ChatDocument extends Chat, Document {}

const chatSchema = new Schema<ChatDocument>({
  participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  latestMessage: { type: Schema.Types.ObjectId, ref: "Message" },
});

export const Chat: Model<ChatDocument> = model<ChatDocument>(
  "Chat",
  chatSchema
);
