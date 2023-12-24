import mongoose from "mongoose";
import { Model, model, Schema, Document } from "mongoose";

export interface Message {
  sender: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
}

export interface MessageDocument extends Message, Document {}

const messageSchema = new Schema<MessageDocument>({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Message: Model<MessageDocument> = model<MessageDocument>(
  "Message",
  messageSchema
);
