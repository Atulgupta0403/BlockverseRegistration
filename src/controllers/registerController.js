const { Worker } = require("worker_threads");
const axios = require("axios");
const Team = require("../models/teams");
const Auth = require("../models/auth");

function generateRandomString() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < 15; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

async function doPostRequest(payload, url) {
  try {
    const res = await axios.post(url, payload);
    console.log(`${url} : `, res.data);
  } catch (err) {
    console.log(`Error Sending Request to ${url}`);
  }
}

const register = async (req, res) => {
  try {
    const {
      team_name,
      l_name,
      l_gender,
      l_email,
      l_otp,
      l_hosteler,
      l_year,
      l_branch,
      l_rollNo,
      l_phoneNo,
    } = req.body;
    // const password = generateRandomString();

    const m_name = req.body.m_name ?? "";
    const m_gender = req.body.m_gender ?? "";
    const m_email = req.body.m_email ?? "";
    const m_branch = req.body.m_branch ?? "";
    const m_hosteler = req.body.m_hosteler ?? false;
    var m_otp = req.body.m_otp ?? "";
    var m_year = req.body.m_year ?? "";
    var m_rollNo = req.body.m_rollNo ?? "";
    var m_phoneNo = req.body.m_phoneNo ?? "";
    var leader_verified = false;
    var member_verified = false;

    if (m_name) {
      m_otp = parseInt(m_otp);
      m_year = parseInt(m_year);
      m_rollNo = parseInt(m_rollNo);
      m_phoneNo = parseInt(m_phoneNo);
    }

    //check for otp
    const currentDate = new Date();
    const leader = await Auth.findOne({ email: l_email });
    console.log(leader)
    console.log(l_otp)
    if (leader) {
      if (m_name) {
        const member = await Auth.findOne({ email: m_email });
        if (member) {
          if (
            leader.otpExpiresAt <= currentDate &&
            member.otpExpiresAt <= currentDate
          ) {
            return res.status(500).json({
              status: "false",
              message: "OTP expired",
            });
          } else if (leader.otp !== l_otp) {
            return res.status(500).json({
              status: "false",
              email: l_email,
              message: "OTP did not match",
            });
          } else if (member.otp !== m_otp) {
            return res.status(500).json({
              status: "false",
              email: m_email,
              message: "OTP did not match",
            });
          } else {
            leader_verified = true;
            member_verified = true;
          }
        } else {
          return res.status(500).json({
            status: "false",
            message: "Email not Verified",
          });
        }
      } else {
        if (leader.otpExpiresAt <= currentDate) {
          return res.status(500).json({
            status: "false",
            message: "OTP expired",
          });
        } else if (leader.otp !== l_otp) {
          return res.status(500).json({
            status: "false",
            email: m_email,
            message: `OTP did not matchhh`,
          });
        } else {
          leader_verified = true;
        }
      }
    } else {
      return res.status(500).json({
        status: "false",
        message: "Email not Verified",
      });
    }

    //check for team_name or team_member existence
    const existingTeam = await Team.findOne({ team_name: team_name });
    const existingLeader = await Team.findOne({
      $or: [
        { leader_email: l_email },
        { leader_rollNo: l_rollNo },
        { member_email: l_email },
        { member_rollNo: l_rollNo },
      ],
    });

    if (m_email) {
      const existingMember = await Team.findOne({
        $or: [
          { leader_email: m_email },
          { leader_rollNo: m_rollNo },
          { member_email: m_email },
          { member_rollNo: m_rollNo },
        ],
      });
      if (existingMember) {
        return res
          .status(500)
          .json({ success: "false", message: "member exist" });
      }
    }

    if (existingTeam) {
      return res
        .status(500)
        .json({ success: "false", message: "team name exists" });
    } else if (existingLeader) {
      return res
        .status(500)
        .json({ success: "false", message: "leader exits" });
    } else {
      const data = new Team({
        team_name: team_name,
        leader_name: l_name,
        leader_gender: l_gender,
        leader_email: l_email,
        leader_hosteler: l_hosteler,
        leader_year: parseInt(l_year),
        leader_branch: l_branch,
        leader_rollNo: parseInt(l_rollNo),
        leader_phoneNo: parseInt(l_phoneNo),
        leaderIsVerified: leader_verified,
        member_name: m_name,
        member_gender: m_gender,
        member_email: m_email,
        member_hosteler: m_hosteler,
        member_year: m_year ? parseInt(m_year) : "",
        member_branch: m_branch,
        member_rollNo: m_rollNo ? parseInt(m_rollNo) : "",
        member_phoneNo: m_phoneNo ? parseInt(m_phoneNo) : "",
        memberIsVerified: member_verified,
      });

      data
        .save()
        .then((data1) => {
          const worker = new Worker("./src/controllers/rSuccessController.js", {
            workerData: { name: team_name, email: l_email },
          });
          if (data1._id) {
            worker.on("error", async (err) => {
              console.log(err);
              Team.deleteOne({ team_name: data1.team_name })
                .then(() => {
                  return res.status(500).json({
                    success: false,
                    message: "Registration failed",
                  });
                })
                .catch((err) => {});
            });

            doPostRequest(
              { APIPin: process.env.PHASE2APIKEY, ...data1._doc },
              "https://blockverse.crypthunt.brlakgec.com/register"
            ); //post request to phase 2
            doPostRequest(
              { APIPin: process.env.PHASE1APIKEY, ...data1._doc },
              "https://api.phase1.brlakgec.com/registration/"
            ); //post request to phase 1
            return res.status(200).json({
              success: true,
              message: "Registration successful",
            });
          } else {
            return res.status(500).json({
              success: false,
              message: "Registration failed",
            });
          }
        })

        .catch((error) => {
          console.log(error);
          return res.status(500).json({
            success: false,
            message: "Registration failed",
          });
        });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

module.exports = register;
