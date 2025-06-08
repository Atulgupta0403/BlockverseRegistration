const mongoose = require("mongoose");

//defining structure
const authSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: Number,
        required: true,
    },
    valid: {
        type: Boolean,
        default: true
    },
    otpExpiresAt: {
        type: Date,
        required: true,
        default: () => new Date(+ new Date() + 15 * 60 * 1000),
    }
}, { timestamps: true });

//creating collection
const Auth = mongoose.model("Auth", authSchema);

//export
module.exports = Auth;