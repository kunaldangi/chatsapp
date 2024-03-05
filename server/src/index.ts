// --- Libraries ---
import { config as envSetup } from "dotenv"; envSetup();
import { createServer, Server as HTTPServer } from "http";
import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";

// --- Modules ---
import { ioServer } from "./socket";
import { Database } from "./db";

const port: number = 8080;
const expressApp: Express = express();
const httpServer: HTTPServer = createServer(expressApp);

expressApp.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
expressApp.use(bodyParser.json());

const dbServer: Database = new Database();
dbServer.initialize();

const socketServer: ioServer = new ioServer(httpServer);




httpServer.listen(port, () => {
    console.log(`Express Server is running at http://localhost:${port}`);
});
