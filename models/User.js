const mongoose = require('mongoose');
const {Schema} = mongoose;

const ContactSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    email:{
        type: String,
        required: true
    },
    profileImage:{
        type: String,
        default: "/defaultprofileImg.png"
    }
});

const UserSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    profileImage:{
        type: String
    },
    date:{
        type: String,
        default: Date.now
    },
    contacts:[ContactSchema]
});

module.exports = mongoose.model('users', UserSchema);