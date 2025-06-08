const mongoose = require("mongoose");
const schema = mongoose.Schema;

const allotmentSchema = new schema({
    team_name: {
        type: String,
    },
    leader_email: {
        type: String,
    },
    lab_alloted: {
        type: String
    }
}, { timestamps: true });

const Venue = new mongoose.model("Venue", allotmentSchema);

module.exports = Venue;
