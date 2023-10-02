const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv'); dotenv.config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const app = express()
const port = 8080

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with the actual origin of your client
    credentials: true, // Allow credentials
    // origin: ['http://localhost:3000', 'http://172.16.0.2:3000']
    // orgin: '*',
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(session({
    secret: 'test-test-test', // Replace with a secret key for session encryption
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    // Lookup user by ID in your database
    User.findById(id, (err, user) => {
        if (err) {
            return done(err, null);
        }
        done(null, user);
    });
});


app.get('/', (req, res)=>{
    console.log('Received cookies:', req.cookies);
    res.send(JSON.stringify({status:"success"}));
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
    // You can handle user creation or sign-in logic here
    // 'profile' contains user information from Google

    // Assuming you have a User model/schema, you can create a user object like this:
    const user = {
        googleId: profile.id, // Adjust this according to your User model
        displayName: profile.displayName,
        email: profile.emails[0].value,
        // Add other user properties as needed
    };

    // Call 'done' with the user object
    return done(null, user);
}));



// Create a route to initiate the OAuth flow
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Create a route to handle the OAuth callback
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Redirect to your Next.js app or return JSON response as needed
        res.redirect('http://localhost:3000'); // Redirect to your Next.js app
    }
);



app.listen(port, ()=>{
    console.log(`Server started on PORT: ${port}`);
})