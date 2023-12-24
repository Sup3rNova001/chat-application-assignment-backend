import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    mongoose
      .connect(process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/chat-app")
      .then(() => console.log("MongoDB connected..."))
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
