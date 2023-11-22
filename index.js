const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv'); dotenv.config();
const jwt = require('jsonwebtoken');
const cookie = require("cookie");
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const connectDatabase = require("./config/db");
const next = require('next');
const path = require('path');
const { setupSocketConnection } = require("./socket");
const {verifyToken} = require("./utils/auth");

const dev = true // true for development, false for production
const port = 8080;
const nextApp = next({ dev,  port});
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {

    connectDatabase("mongodb://localhost:27017/chatsapp");
    const app = express();
    const server = createServer(app);
    const io = new Server(server, {
        cors: {
            // origin: "http://localhost:3000",
            credentials: true
        }
    });

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true, // Enable credentials (cookies)
    }));

    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    }));


    app.use('/auth/google', require('./routes/auth/google'));
    app.use(async (req, res, next) => {
        if (!req.cookies.login_token) {
            if(req.url.includes('/users') || req.url.includes('/chats')){
                return res.send(JSON.stringify({
                    status: "failed!",
                    action: "Invaild token!"
                }));
            }
            else if(req.url == '/' ){
                return res.redirect('/signin');
            }
            next();
        }
        else {
            try {
                let result = await verifyToken(req.cookies.login_token, process.env.LOGIN_TOKEN_SECRET);
                req.token_data = result;
                next();
            } catch (error) {
                return res.send(JSON.stringify({
                    status: "failed!",
                    action: `${error}`
                }));
            }
        }
    });
    app.use('/user', require('./routes/user'));

    app.use('/verifytoken', (req, res) => {
        return res.send(JSON.stringify({
            status: "success!",
            action: "Vaild token!"
        }));
    })

    app.use('/chats', require("./routes/chats"));

    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers.cookie || "");
        if (cookies.login_token) {
            try {
                let result = await verifyToken(cookies.login_token, process.env.LOGIN_TOKEN_SECRET);
                socket.token_data = result;
                next();
            } catch (error) {
                
            }
        }
    });

    setupSocketConnection(io);
    
    app.use(express.static(path.join(__dirname, 'public')));

    app.get('*', (req, res) => { // for all the other routes, use next.js
        return handle(req, res);
    });

    server.listen(port, () => {
        console.log(`Server listening on PORT: ${port}`);
    });

});