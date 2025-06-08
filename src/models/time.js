const mongoose = require("mongoose");

//defining structure
const timeSchema = new mongoose.Schema({
    startTime: {
        type: Date,
        default: () => new Date()
    },
    endTime: {
        type: Date,
        default: () => new Date('2025-06-11T00:00:00Z')
    }
}, { timestamps: true });

//creating collection
const Time = mongoose.model("Time", timeSchema);

module.exports = Time;