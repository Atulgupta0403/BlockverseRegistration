const { parentPort, workerData } = require("worker_threads");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const templatePath = path.join(__dirname, "registration.html");
// Compile the Handlebars template
const source = fs.readFileSync(templatePath, "utf8");
const template = handlebars.compile(source);

const attachmentUrl = "https://brl-assets.s3.ap-south-1.amazonaws.com/card.png";
// Define the variables to use in the template
const variables = {
  name: workerData.name,
  password: workerData.password,
};

const email = workerData.email;

// Generate the HTML content using the variables and template
const html = template(variables);

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const options1 = {
  from: process.env.EMAIL,
  to: email,
  subject: "Registration Successful!",
  html: html,
  attachments: [
    {
      filename: "blockverse_ticket.png",
      path: attachmentUrl,
    },
  ],
};

transporter
  .sendMail(options1)
  .then(() => {})
  .catch((err) => {
    throw err;
  });
