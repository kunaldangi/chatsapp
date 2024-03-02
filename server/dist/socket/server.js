"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ioServer = void 0;
const socket_io_1 = require("socket.io");
class ioServer {
    constructor(httpServer) {
        console.log("Initializing socket server!");
        this.io = new socket_io_1.Server(httpServer, {
            cors: {
                allowedHeaders: ['*'],
                origin: "*",
                credentials: true
            }
        });
        this.io.on("connection", (socket) => {
            console.log(`${socket.handshake.address} user connected with ID: ${socket.id}`);
            socket.on("disconnect", () => {
                console.log(`${socket.handshake.address} user disconnected with ID: ${socket.id}`);
            });
        });
    }
}
exports.ioServer = ioServer;
