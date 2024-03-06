// --- Libraries ---
import { config as envSetup } from "dotenv"; envSetup();
import { createServer, Server as HTTPServer } from "http";
import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// --- Modules ---
import socketServer from "./socket";
import db from "./db";

// --- Routes ---
import authRouter from "./routes/api/auth";

const port: number = 8080;
const expressApp: Express = express();
const httpServer: HTTPServer = createServer(expressApp);

expressApp.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
expressApp.use(bodyParser.json());
expressApp.use(cookieParser());

db.initialize();
socketServer.initialize(httpServer);

expressApp.use("/api/auth", authRouter);


httpServer.listen(port, () => {
    console.log(`Express Server is running at http://localhost:${port}`);
});
