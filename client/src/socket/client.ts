import { Socket as SocketClient, io } from "socket.io-client";

export class ioClient {
    public io: SocketClient;
    
    constructor() {
        console.log("Initializing socket client!");
        this.io = io("http://localhost:8080");

        this.io.on("connect", () => {
            console.log("connecteds");
        });
    }
}
