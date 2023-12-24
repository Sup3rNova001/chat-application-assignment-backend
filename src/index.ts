import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
import { connectDb } from "./config/dbConfig";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import chatRoutes from "./routes/chat.routes";
import messageRoutes from "./routes/message.routes";
import cors from "cors";
import initSocketIO from "./services/socket.service";

const app = express();
app.use(express.json());
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const httpServer = createServer(app);
export const io = initSocketIO(httpServer);

app.get("/api/health", (req: Request, res: Response) => {
  const message: string = "API is healthy!";
  res.status(200).json({ message });
});

app.use("/api/users", userRoutes);
app.use("/api", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

connectDb();

const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
