// --- Libraries ---
import express, { Router } from "express";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// --- Database ---
import db from "../../../db";

// --- Custom Libraries ---
import { generate_otp_code, OTPType } from "../../../lib/otp";
import { send_mail } from "../../../lib/mail";
import verifyToken from "../../../lib/jwt";

const router: Router = express.Router();

router.post("/register", async (req, res) => {
    try {
        if (!req.body.username || !req.body.password || !req.body.email) return res.send(JSON.stringify({ error: "Missing required fields." }));
        if (!validator.isEmail(req.body.email)) return res.send(JSON.stringify({ error: "Invalid email." }));
        if (!validator.isAlpha(req.body.username, "en-US")) return res.send(JSON.stringify({ error: "Invalid username." }));
        if (req.body.password.length < 8) return res.send(JSON.stringify({ error: "Invalid password length." }));

        let checkEmail = await db.otp?.findAll({ where: { email: req.body.email } });
        console.log(checkEmail);

        const otp_code: number = generate_otp_code();
        const otp_payload = {
            type: OTPType.RegisterUser,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };

        await db.otp?.destroy({ where: { email: req.body.email } });
        const otp = await db.otp?.create({ type: otp_payload.type, code: otp_code, email: otp_payload.email });

        let email_status: any = await send_mail({
            from: process.env.GMAIL_ID,
            to: req.body.email,
            subject: "Verfication code",
            text: `Your one time password for registering your account at chatsapp is ${otp_code}. This code will expire in 1 hour.`
        });

        if (email_status.accepted == req.body.email) {
            const otp_token: string = jwt.sign(otp_payload, process.env.JWT_OTP_SECRET || '', { expiresIn: '1h' });
            const oneHour: number = 60 * 60 * 1000;
            res.cookie('otp_token', otp_token, { maxAge: oneHour });
            return res.send(JSON.stringify({ success: "OTP sent to your email." }));
        }
        else {
            res.send(JSON.stringify({ error: "Error sending OTP to your email." }));
        }

        return res.send(JSON.stringify({ error: "Something went wrong." }));
    } catch (error) {
        console.log(`ERROR (/api/auth/register): ${error}`);
        return res.send(JSON.stringify({error: "Something went wrong!"}));
    }
});

router.post("/verify", async (req, res) => {
    if (!req.cookies?.otp_token) return res.send(JSON.stringify({ error: "Something went wrong!" }));
    if (!req.body.code) return res.send(JSON.stringify({ error: "Invalid OTP code." }));

    let otp_data: any;
    try { otp_data = await verifyToken(req.cookies?.otp_token, process.env.JWT_OTP_SECRET || ''); } catch (error) { return res.send(JSON.stringify({ error: "Invalid OTP code." })); }
    if((otp_data.exp - (Date.now() / 1000)) < 0) return res.send({ error: "OTP expired!" });

    try {
        let getDbOtp: any = await db.otp?.findAll({ where: { email: otp_data.email, code: req.body.code } });
        if(req.body.code !== getDbOtp[0]?.dataValues.code || !getDbOtp[0]?.dataValues) return res.send(JSON.stringify({ error: "Invalid OTP code." }));
        
        let saltPass: string = bcrypt.genSaltSync(10);
        let hashPass: string = bcrypt.hashSync(otp_data.password, saltPass);
    
        await db.otp?.destroy({ where: { email: otp_data.email } });
        let userData: any = await db.user?.create({ username: otp_data.username, email: otp_data.email, password: hashPass });
    
        if(userData?.dataValues.email){
            res.clearCookie('otp_token');
            return res.send(JSON.stringify({ success: "Account created successfully!"}));
        }
    
        res.send(JSON.stringify({error: "Something went wrong!"}));
    } catch (error) {
        console.log(`ERROR (/api/auth/verify): ${error}`);
        return res.send(JSON.stringify({error: "Something went wrong!"}));
    }
});

router.post("/login", async (req, res) => {
    if(!req.body.email || !req.body.password) return res.send(JSON.stringify({ error: "Missing required fields." }));
    if (!validator.isEmail(req.body.email)) return res.send(JSON.stringify({ error: "Invalid email." }));
    if (req.body.password.length < 8) return res.send(JSON.stringify({ error: "Invalid password length." }));

    try {
        let dbUserData: any = await db.user?.findAll({where: { email: req.body.email}});
        if(!dbUserData[0]?.dataValues) return res.send(JSON.stringify({ error: "Invalid email or password." }));
    
        const passHash: string = dbUserData[0]?.dataValues.password;
        if(!bcrypt.compareSync(req.body.password, passHash)) return res.send(JSON.stringify({error: "Invalid email or password."}));
    
        const sessionPayload = {
            userId: dbUserData[0]?.dataValues.id,
            username: dbUserData[0]?.dataValues.username,
            email: dbUserData[0]?.dataValues.email,
            createdAt: dbUserData[0]?.dataValues.createdAt
        }
        
        const session_token = jwt.sign(sessionPayload, process.env.JWT_SESSION_SECRET || '', { expiresIn: '7d' }); // Session valid for 7 days
        const days = 7 * 24 * 60 * 60 * 1000;
    
        res.cookie('session', session_token, { maxAge: days });
        res.send(JSON.stringify({ success: "Logged in successfully!" }));
    } catch (error) {
        console.log(`ERROR (/api/auth/login): ${error}`);
        res.send(JSON.stringify({error: "Something went wrong!"}));  
    }
});

export default router;
