import { Server as HTTPServer } from "http";
import { Server as ServerSocket, Socket as ClientSocket} from "socket.io";

import verifyToken from "../lib/jwt";
import { initializeEvents } from "./events";

export class ioServer{
	public serverIO: ServerSocket = {} as ServerSocket;
	public usersData: Map<string, any> = new Map();
	public connectedUsers: Map<number, ClientSocket> = new Map();

	public initialize(httpServer: HTTPServer){
		console.log("Initializing socket server!");
		this.serverIO = new ServerSocket(httpServer,{
			cors: {
				allowedHeaders: ['*'],
				origin: "http://localhost:3000",
				credentials: true
			}
		});

		this.serverIO.use(async (clientSocket: ClientSocket, next) => { // client authentication
			if (clientSocket.handshake.headers.cookie) {
				const cookie = require('cookie');
				const parsedCookies = cookie.parse(clientSocket.handshake.headers.cookie);

				try { 
					const sessionData: any = await verifyToken(parsedCookies?.session || '', process.env.JWT_SESSION_SECRET || '');
					this.usersData.set(clientSocket.id, sessionData);
					this.connectedUsers.set(sessionData.userId, clientSocket);
				} catch (error) { 
					console.log("Session not found!");
					clientSocket.disconnect();
				}
			}
			next();
		});

		this.serverIO.on("connection", (clientSocket: ClientSocket) => {
			console.log(`${clientSocket.handshake.address} user connected with ID: ${clientSocket.id}`);
			// const userData = this.usersData.get(clientSocket.id);
			// console.log(this.usersData.get(clientSocket.id), this.connectedUsers.get(userData?.id));

			initializeEvents(this, clientSocket);
		
			clientSocket.on("disconnect", () => {
				console.log(`${clientSocket.handshake.address} user disconnected with ID: ${clientSocket.id}`);
				const userData = this.usersData.get(clientSocket.id);
				this.usersData.delete(clientSocket.id);
				this.connectedUsers.delete(userData?.id);
			});
		});
	}
}

const socketServer: ioServer = new ioServer();
export default socketServer;