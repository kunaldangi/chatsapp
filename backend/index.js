const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv'); dotenv.config();
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const connectDatabase = require("./config/db");

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
    if(!req.cookies.login_token){
        return res.send(JSON.stringify({
            status: "failed!",
            action: "Invaild token!"
        }));
    }
    else{
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

app.use('/verifytoken', (req, res)=>{
    return res.send(JSON.stringify({
        status: "success!",
        action: "Vaild token!"
    }));
})

app.use('/chats', require("./routes/chats"));

io.use((socket, next) => {
    // if(socket.handshake.headers.cookie === undefined){
    //     return next(new Error('Authentication error'));
    // }
    const cookies = cookie.parse(socket.handshake.headers.cookie || '');
    const loginToken = cookies.login_token;
    // console.log('Login Token:', loginToken);
    next();
});


io.on('connection', (socket) => {
    // console.log('a user connected');
    socket.on('disconnect', () => {
        // console.log('user disconnected');
    });

    socket.on('chat', (msg) => {
        // console.log('message: ' + msg);
    });
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