const mongoose = require('mongoose');
const {Schema} = mongoose;

const ParticipantsSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isOnline: {
        type: Boolean,
        required: true,
        default: false
    },
    unreadMsgs: {
        type: Number,
        required: true,
        default: 0
    }
});

const MessagesSchema = new Schema({
    sender:{
        type: String,
        required: true
    },
    receiver:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    date:{
        type: String,
        default: Date.now
    },
    isRead:{
        type: Boolean,
        required: true,
        default: false
    }
})

const UserChatSchema = new Schema({
    participants: [ParticipantsSchema],
    messages: [MessagesSchema]
});

module.exports = mongoose.model('userschats', UserChatSchema);