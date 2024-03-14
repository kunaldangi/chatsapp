import {Server as ServerSocket, Socket as ClientSocket } from "socket.io";
import UserDetails from "./UserDetails";
import { ioServer } from "..";

export function initializeEvents(socketServer: ioServer, clientSocket: ClientSocket){
    UserDetails(socketServer, clientSocket);
}