const { workerData } = require("worker_threads");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
var count = 1;

//export
let team_name = workerData.team_name;
let email = workerData.email;
let lab = workerData.lab;

const templatePath = path.join(__dirname, "lab_email.html");
// Compile the Handlebars template
const source = fs.readFileSync(templatePath, "utf8");
const template = handlebars.compile(source);

const variables = {
    team: team_name,
    lab: lab
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
    subject: "[Blockverse'23] Venue Details",
    html: html,
};

transporter.sendMail(mailOptions).then(() => {
    console.log("Email Sent to candidate" + count);
    count++;
})