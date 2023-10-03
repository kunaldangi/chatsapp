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
    }
})

const UserChatSchema = new Schema({
    participants: [ParticipantsSchema],
    messages: [MessagesSchema]
});

module.exports = mongoose.model('userschats', UserChatSchema);