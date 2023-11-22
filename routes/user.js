const express = require('express');
const User = require("../models/User");
const router = express.Router();

router.get('/details', async (req, res)=>{
    const user_detials = await User.findOne({email: req.token_data.data.email});
    return res.send(JSON.stringify(user_detials));
});

router.post('/addcontact', async (req, res)=>{
    const newContact = {
        name: req.body.name,
        email: req.body.email
    };
    const userContact = await User.findOne({email: newContact.email});
    if(!userContact) return res.send(JSON.stringify({status: "failed!", action: "The email is not registered."}));
    newContact.profileImage = userContact.profileImage;

    const user = await User.findOne({ email: req.token_data.data.email });
    const foundContact = user.contacts.find((contact) => contact.email === newContact.email);

    if(req.body.email == req.token_data.data.email) return res.send(JSON.stringify({status: "failed!", action: "You cannot add your email to the contact list."}))
    if(foundContact) return res.send(JSON.stringify({status: "failed!", action: "The email is already saved in the contacts."}));
    
    user.contacts.push(newContact);
    const updatedUser = await user.save();
    res.send(JSON.stringify(updatedUser));

});

module.exports = router;