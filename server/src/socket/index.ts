import { Server as HTTPServer } from "http";
import { Server as SocketServer } from "socket.io";

export class ioServer{
	public io: SocketServer = {} as SocketServer;

	public initialize(httpServer: HTTPServer){
		console.log("Initializing socket server!");
		this.io = new SocketServer(httpServer,{
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

const socketServer: ioServer = new ioServer();
export default socketServer;