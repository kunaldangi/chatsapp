const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const router = express.Router();

router.use(passport.initialize());
router.use(passport.session()); // Use passport.session() middleware for session support

passport.serializeUser((user, done) => { // Passport serialization and deserialization
    done(null, user);
});

passport.deserializeUser((user, done) => {
    // Normally, you would fetch the user from your database using user.id,
    // but for this example, we'll assume user is already deserialized correctly.
    done(null, user);
});


passport.use(new GoogleStrategy({ // Google OAuth Strategy
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => { // Create a user object based on 'profile' data

    const user = {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value, // Add other user properties as needed
        image: profile.photos[0].value
    };

    return done(null, user); // Call 'done' with the user object
}));

router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/callback', passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => { // Redirect to Next.js app or return JSON response
        const user = req.user;
        const check_email = await User.findOne({email: user.email});
        if(check_email){
            let payload = {
                state: true,
                data: check_email
            }
            const login_token = jwt.sign(payload, process.env.LOGIN_TOKEN_SECRET);
            // console.log("Payload: ", payload, "\nLogin Token: ", login_token);
            res.cookie('login_token', `${login_token}`, { maxAge: (10 * 365 * 24 * 60 * 60)}); // 10 year cookie age
        }
        else{
            console.log("No account found!");
            let pass = generateRandomPassword(12);
            const newUser = new User({
                username: user.displayName,
                email: user.email,
                password: pass,
                profileImage: user.image
            });
            await newUser.save();

            let payload = {
                state: true,
                data: {
                    username: user.displayName,
                    email: user.email,
                    password: pass
                }
            }
            const login_token = jwt.sign(payload, process.env.LOGIN_TOKEN_SECRET);
            // console.log("Payload: ", payload, "\nLogin Token: ", login_token);
            res.cookie('login_token', `${login_token}`);
        }
        res.redirect('http://localhost:8080');
    }
);

function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
    if (length <= 0) {
      throw new Error("Password length must be greater than 0");
    }
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }  
    return password;
}

module.exports = router;