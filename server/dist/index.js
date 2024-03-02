"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.js
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const server_1 = require("./socket/server");
const port = 8080;
const expressApp = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(expressApp);
expressApp.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true
}));
expressApp.use(body_parser_1.default.json());
const socketServer = new server_1.ioServer(httpServer);
httpServer.listen(port, () => {
    console.log(`Express Server is running at http://localhost:${port}`);
});
