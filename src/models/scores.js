const mongoose = require("mongoose");
const schema = mongoose.Schema;

const scoreSchema = new schema({
    team_name: {
        type: String,
    },
    leader_email: {
        type: String,
    },
    score_phase1: {
        type: Number,
    },
    score_phase2: {
        type: Number,
    }
}, { timestamps: true });

const Score = new mongoose.model("Score", scoreSchema);

module.exports = Score;
