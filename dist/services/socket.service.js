"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const initSocketIO = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
        },
    });
    io.on("connection", (socket) => {
        console.log("A user connected");
        // Handle disconnections
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
    return io;
};
exports.default = initSocketIO;
