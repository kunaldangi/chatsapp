const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv'); dotenv.config();
const jwt = require('jsonwebtoken');
const connectDatabase = require("./config/db");

const app = express();
const port = 8080;
connectDatabase("mongodb://127.0.0.1:27017/chatsapp");

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({ // Session configuration
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

app.listen(port, () => {
    console.log(`Server listening on PORT: ${port}`);
});


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