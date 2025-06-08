const { workerData } = require("worker_threads");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

//export
let team_name = workerData.team_name;
let email = workerData.email;
score_phase1 = workerData.score_phase1;
score_phase2 = workerData.score_phase2;

const templatePath = path.join(__dirname, "score.html");
// Compile the Handlebars template
const source = fs.readFileSync(templatePath, "utf8");
const template = handlebars.compile(source);

const variables = {
    team: team_name,
    phase1: score_phase1,
    phase2: score_phase2,
    total: score_phase1 + score_phase2
};

// Generate the HTML content using the variables and template
const html = template(variables);

const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "BLOCKVERS'23 SCORES",
    html: html,
};

transporter.sendMail(mailOptions).then(() => {
    console.log("Email Sent to candidate")
})