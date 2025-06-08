const Venue = require("../models/allotment");
const { Worker } = require("worker_threads");

const sendEmail = async (req, res) => {
    const data = await Venue.find({});
    if (data) {
        for (let i = 0; i < data.length; i++) {
            new Worker("./src/controllers/venue_email.js", { workerData: { team_name: data[i].team_name, email: data[i].leader_email, lab: data[i].lab_alloted } });
        }
        res.json({
            success: true,
            length: data.length,
            data: data,
            message: "Your request is being processed"
        })
    }
}

// const getAll = (req, res) => {
//     const data = Venue.find({});
//     if (data) {
//         // for (let i = 0; i < data.length; i++) {
//         //     new Worker("./src/controllers/venue_email.js", { workerData: { team_name: data[i].team_name, email: data[i].leader_email, lab: data[i].lab_alloted } });
//         // }
//         res.json({
//             success: true,
//             data: data,
//             message: "Your request is being processed"
//         })
//     }
// }
const makeAllot = (req, res) => {
    const venue = new Venue({ team_name: "XYZ", leader_email: "sjanmejay1@gmail.com", lab_alloted: "MCA Lab 2(BRL Lab, Central Library)" })
    venue.save().then(() => { console.log("Done") })
}

module.exports = { sendEmail, makeAllot };