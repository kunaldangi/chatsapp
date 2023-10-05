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

connectDatabase("mongodb://127.0.0.1:27017/chatsapp");
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});
const port = 8080;

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
        return res.send(JSON.stringify({
            status: "failed!",
            action: "Invaild token!"
        }));
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

    /*socket.on('chat', (msg) => {
        console.log('message: ' + msg);
    });*/
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