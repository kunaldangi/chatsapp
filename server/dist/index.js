"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// --- Libraries ---
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
// --- Modules ---
const socket_1 = require("./socket");
const db_1 = require("./db");
const port = 8080;
const expressApp = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(expressApp);
expressApp.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true
}));
expressApp.use(body_parser_1.default.json());
const dbServer = new db_1.Database();
dbServer.initialize();
const socketServer = new socket_1.ioServer(httpServer);
httpServer.listen(port, () => {
    console.log(`Express Server is running at http://localhost:${port}`);
});
