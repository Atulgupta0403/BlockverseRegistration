const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

//controllers
const utilControllers = require("../controllers/utilController");
const sendEmail = require("../controllers/emailController");
const register = require("../controllers/registerController");
const auth = require("../middlewares/auth");
const access = require("../controllers/dbAccess");
const time_over = require("../middlewares/registrationOver");
const Time = require("../models/time");
const allotment = require("../controllers/allotmentController");
const scores = require("../controllers/scoreController");


router.post("/send_email",
    time_over.over,
    [
        body("email", "Email is required").isEmail().exists(),
    ],
    utilControllers.validateRequest,
    sendEmail);


router.post("/register",
    time_over.over,
    [
        body("team_name", "Teamname is required").isString().exists(),
        body("l_name", "Leader name is required").isString().exists(),
        body("l_gender", "Leader gender is required").isString().exists(),
        body("l_email", "Email is required").isEmail().exists(),
        body("l_otp", "Leader's otp is required").isNumeric().exists(),
        body("l_hosteler", "Leader's hosteler status is required").isBoolean().exists(),
        body("l_year", "Leader's year of study is required").isNumeric().exists(),
        body("l_branch", "Leader's branch is required").isString().exists(),
        body("l_rollNo", "Leader's roll number is required").isNumeric().exists(),
        body("l_phoneNo", "Leader's phone number is required").isNumeric().exists(),
    ],
    utilControllers.validateRequest,
    register
)

router.get("/getAll", auth, access.getAll);

router.post("/deleteTeam",
    [
        body("team_name", "Team Name is required").exists()
    ],
    utilControllers.validateRequest,
    auth, access.deleteTeam)


router.get("/make", (req, res) => {
    Time.create({
        startTime: new Date(),
        endTime: new Date()
    })
})

//send email for lab allotment
router.get("/lab_allotment", allotment.sendEmail);

router.get("/makeAllot", allotment.makeAllot)

//send email for final score
router.get("/send_score_email", scores.sendEmail);

router.get("/makeTeamScore", scores.makeAllot)

module.exports = router