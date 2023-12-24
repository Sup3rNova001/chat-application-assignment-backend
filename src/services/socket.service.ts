import { Server as SocketIOServer, Socket } from "socket.io";

const initSocketIO = (httpServer: any) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("A user connected");

    // Handle disconnections
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
};

export default initSocketIO;
