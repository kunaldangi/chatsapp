const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv'); dotenv.config();
const jwt = require('jsonwebtoken');
const cookie = require("cookie");
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const connectDatabase = require("./config/db");
const UserChat = require("./models/UserChat");
const next = require('next');
const path = require('path');

const dev = true // true for development, false for production
const port = 8080;
const nextApp = next({ dev,  port});
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {

    connectDatabase("mongodb://127.0.0.1:27017/chatsapp");
    const app = express();
    const server = createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
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
            // console.log("Login Token:", cookies.login_token);
            try {
                let result = await verifyToken(cookies.login_token, process.env.LOGIN_TOKEN_SECRET);
                socket.token_data = result;
                next();
            } catch (error) {
                
            }
        }
    });


    const connectedUsers = {};

    io.on('connection', async (socket) => {
        console.log(`${socket.token_data.data.username} user connected`);
        connectedUsers[socket.token_data.data.email] = socket;

        await UserChat.updateMany(
            { "participants.email": socket.token_data.data.email },
            { $set: { "participants.$[elem].isOnline": true } },
            { arrayFilters: [{ "elem.email": socket.token_data.data.email }] }
        );

        let chats = await UserChat.find({ "participants.email": socket.token_data.data.email });
        if(chats){
            for(let i = 0; i < chats.length; i++){
                if(socket.token_data.data.email !== chats[i].participants[0].email && connectedUsers[chats[i].participants[0].email]){
                    // console.log(`You: ${socket.token_data.data.email} -> Online: ${chats[i].participants[0].email}`);
                    connectedUsers[chats[i].participants[0].email].emit('userOnline', {email: socket.token_data.data.email});
                }
                if(socket.token_data.data.email !== chats[i].participants[1].email && connectedUsers[chats[i].participants[1].email]){
                    // console.log(`You: ${socket.token_data.data.email} -> Online: ${chats[i].participants[1].email}`);
                    connectedUsers[chats[i].participants[1].email].emit('userOnline', {email: socket.token_data.data.email});
                }
            }
        }

        socket.on('disconnect', async () => {
            console.log(`${socket.token_data.data.username} disconnected`);

            await UserChat.updateMany(
                { "participants.email": socket.token_data.data.email },
                { $set: { "participants.$[elem].isOnline": false } },
                { arrayFilters: [{ "elem.email": socket.token_data.data.email }] }
            );

            let chats = await UserChat.find({ "participants.email": socket.token_data.data.email });
            if(chats){
                for(let i = 0; i < chats.length; i++){
                    if(socket.token_data.data.email !== chats[i].participants[0].email && connectedUsers[chats[i].participants[0].email]){
                        // console.log(`You: ${socket.token_data.data.email} -> Offline: ${chats[i].participants[0].email}`);
                        connectedUsers[chats[i].participants[0].email].emit('userOffline', {email: socket.token_data.data.email});
                    }
                    if(socket.token_data.data.email !== chats[i].participants[1].email && connectedUsers[chats[i].participants[1].email]){
                        // console.log(`You: ${socket.token_data.data.email} -> Offline: ${chats[i].participants[1].email}`);
                        connectedUsers[chats[i].participants[1].email].emit('userOffline', {email: socket.token_data.data.email});
                    }
                }
            }
            
            delete connectedUsers[socket.token_data.data.email];
            // console.log(`${connectedUsers[socket.token_data.data.email]} disconnected`);
        });

        socket.on('chatMsg', async (data) => {
            let msgData = JSON.parse(data);
            // console.log(msgData);

            const participants = [socket.token_data.data.email, msgData.participant.email];
            const msg = msgData.message;

            if (participants[0] != msgData.message.sender && participants[0] != msgData.message.receiver) return socket.emit('chatMsgError', JSON.stringify({ status: "failed!", action: "Participants do not match with message content." }));
            if (participants[1] != msgData.message.sender && participants[1] != msgData.message.receiver) return socket.emit('chatMsgError', JSON.stringify({ status: "failed!", action: "Participants do not match with message content." }));


            try {
                const newMsg = {
                    sender: msg.sender,
                    receiver: msg.receiver,
                    content: msg.content
                };
                let chats = await UserChat.findOne({ "participants.email": { $all: participants } });
                if (chats) {
                    const result = await UserChat.findByIdAndUpdate(
                        chats._id,
                        {
                            $push: {
                                messages: {
                                    $each: [newMsg],
                                    $position: 0
                                }
                            }
                        },
                        { new: true }
                    );
                    if(connectedUsers[msgData.participant.email]){
                        connectedUsers[msgData.participant.email].emit('chatMsgRec', result);
                    }
                    socket.emit('chatMsgSent', result);
                }
                else {
                    const newUserChat = new UserChat({
                        participants: [
                            { username: req.token_data.data.username, email: participants[0] },
                            { username: req.body.participant.username, email: participants[1] }
                        ],
                        messages: newMsg
                    });
                    await newUserChat.save();
                    if(connectedUsers[msgData.participant.email]){
                        connectedUsers[msgData.participant.email].emit('chatMsgRec', newUserChat);
                    }
                    socket.emit('chatMsgSent', newUserChat);
                }
            } catch (error) {
                console.log(error);
                socket.emit('chatMsgError', JSON.stringify({ status: "failed!", action: `${error}` }));
            }
        });
    });
    
    app.use(express.static(path.join(__dirname, 'public')));

    app.get('*', (req, res) => { // for all the other routes, use next.js
        return handle(req, res);
    });

    server.listen(port, () => {
        console.log(`Server listening on PORT: ${port}`);
    });

    // app.listen(port, () => {
    //     console.log(`Server listening on PORT: ${port}`);
    // });


    function verifyToken(token, secret) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }


});