const Auth = require("../models/auth");
const { Worker } = require("worker_threads");

const generateOTP = (length = 4) => {
    let otp = ''
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10)
    }
    return otp;
}

const sendEmail = async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();
    const existing_data = await Auth.findOne({ email: email });
    if (existing_data) {
        existing_data.otpExpiresAt = new Date(+ new Date() + 15 * 60 * 1000);
        existing_data.otp = otp;
        existing_data.valid = true;
        existing_data.save().then(() => {
            new Worker("./src/controllers/sendEmail.js", { workerData: { email: email, otp: otp } });
            return res.status(200).json({
                status: true,
                message: "Email sent successfullyyy"
            })
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({
                status: false,
                message: "Some error occured",
            });
        })
    } else {
        const data = await Auth.create({
            email: email,
            otp: otp,
        })
        data.save().then(() => {
            new Worker("./src/controllers/sendEmail.js", { workerData: { email: email, otp: otp } });
            res.status(200).json({
                success: true,
                message: "Email sent successfully"
            })
        }).catch((err) => {
            return res.status(500).json({
                status: "false",
                message: "Some error occured",
            });
        })
    }
}

module.exports = sendEmail;