import mongoose from "mongoose";
import { Model, model, Schema, Document } from "mongoose";

export interface User {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  password: string;
  profilePic: {
    filename: string;
    url: string;
  };
  date: Date;
}

export interface UserDocument extends User, Document {
  chatRooms: mongoose.Types.ObjectId[];
}

export const userSchema = new Schema<UserDocument>({
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: {
    filename: { type: String, required: false },
    url: { type: String, required: false },
  },
  date: { type: Date, default: Date.now },
});

// Define a virtual field for chatRooms
userSchema.virtual('chatRooms', {
  ref: 'Chat',
  localField: '_id',
  foreignField: 'participants',
});

export const User: Model<UserDocument> = model<UserDocument>(
  "User",
  userSchema
);
