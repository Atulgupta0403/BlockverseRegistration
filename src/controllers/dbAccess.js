const Team = require("../models/teams");

const getAll = async (req, res) => {
    await Team.find({}).then((data) => {
        return res.status(200).json({
            success: true,
            message: "data fetched successfully",
            data: data
        });
    }).catch((error) => {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    })
}

const deleteTeam = async (req, res) => {
    const team_name = req.body.team_name;
    await Team.deleteOne({ team_name: team_name }).then(() => {
        return res.status(200).json({
            success: true,
            message: "Team Deleted"
        });
    }).catch((error) => {
        return res.status(500).json({
            success: false,
            message: "Error in Deletion",
            error: error.message
        })
    })

}

module.exports = { getAll, deleteTeam };