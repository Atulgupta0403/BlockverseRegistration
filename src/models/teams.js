const mongoose = require("mongoose");
const schema = mongoose.Schema;

const teamSchema = new schema(
  {
    team_name: {
      type: String,
      unique: true,
    },
    // password: {
    //     type: String,
    //     required: true,
    // },
    leader_name: {
      type: String,
      required: true,
    },
    leader_gender: {
      type: String,
      required: true,
    },
    leader_email: {
      type: String,
      unique: true,
      validate: {
        validator: function (value) {
          return value.toLowerCase().endsWith("@akgec.ac.in");
        },
        message: (props) =>
          `${props.value} is not a valid email address from @akgec.ac.in`,
      },
    },
    leader_hosteler: {
      type: Boolean,
      default: false,
    },
    leader_year: {
      type: Number,
    },
    leader_branch: {
      type: String,
    },
    leader_rollNo: {
      type: Number,
    },
    leader_phoneNo: {
      type: Number,
    },
    member_name: {
      type: String,
      default: "",
    },
    member_gender: {
      type: String,
      default: "",
    },
    member_phoneNo: {
      type: Number,
      default: "",
    },
    member_branch: {
      type: String,
      default: "",
    },
    member_email: {
      type: String,
      required: false,
      default: "",
      validate: {
        validator: function (value) {
          // Check if the email domain is 'example.com'
          if (!value) {
            return true;
          }
          return value.toLowerCase().endsWith("@akgec.ac.in");
        },
        message: (props) =>
          `${props.value} is not a valid email address from @akgec.ac.in`,
      },
    },
    member_rollNo: {
      type: Number,
      default: "",
    },
    member_hosteler: {
      type: Boolean,
      default: false,
    },
    member_year: {
      type: Number,
      default: "",
    },
    leaderIsVerified: {
      type: Boolean,
      default: false,
    },
    memberIsVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

teamSchema.pre("save", function (next) {
  // Convert the email to lowercase
  this.leader_email = this.leader_email.toLowerCase();
  if (this.member_email) {
    this.member_email = this.member_email.toLowerCase();
  }
  next();
});

const Teams = new mongoose.model("Teams", teamSchema);

module.exports = Teams;
