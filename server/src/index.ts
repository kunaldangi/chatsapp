// index.js
import { createServer, Server as HTTPServer } from "http";
import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ioServer } from "./socket/server";

const port: number = 8080;
const expressApp: Express = express();
const httpServer: HTTPServer = createServer(expressApp);

expressApp.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
expressApp.use(bodyParser.json());

const socketServer: ioServer = new ioServer(httpServer);

httpServer.listen(port, () => {
    console.log(`Express Server is running at http://localhost:${port}`);
});
