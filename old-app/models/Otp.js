const mongoose = require('mongoose');
const {Schema} = mongoose;

const OtpSchema = new Schema({
    otp_type:{
        type: String,
        required: true
    },
    otp_code:{
        type: String,
        required: true
    },
    otp_email:{
        type: String,
        required: true
    },
    otp_time:{
        type: String,
        default: Date.now,
        required: true
    }
});

module.exports = mongoose.model('otp', OtpSchema);