const Time = require("../models/time");

exports.over = async (req, res, next) => {
    await Time.find({}).then((time) => {
        time = time[0];
        const now = new Date();
        if (now > time.endTime) {
            return res.json({
                success: true,
                message: "Registration has been ended"
            })
        }
        next();
    }).catch((err) => {
        console.log(err);
    })
}