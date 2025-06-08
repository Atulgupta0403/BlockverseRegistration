const Score = require("../models/scores");
const { Worker } = require("worker_threads");

const sendEmail = async (req, res) => {
    const data = await Score.find({});
    if (data) {
        for (let i = 0; i < data.length; i++) {
            new Worker("./src/controllers/scoreEmail.js", { workerData: { team_name: data[i].team_name, email: data[i].leader_email, score_phase1: data[i].score_phase1, score_phase2: data[i].score_phase2 } });
        }
        res.json({
            success: true,
            length: data.length,
            data: data,
            message: "Your request is being processed"
        })
    }
}

const makeAllot = (req, res) => {
    const score = new Score({ team_name: "XYZ", leader_email: "tripathiharsh16@gmail.com", score_phase1: 15, score_phase2: 15 })
    score.save().then(() => {
        console.log("Done")
        res.send("Team Added")
    })
}

module.exports = { sendEmail, makeAllot };