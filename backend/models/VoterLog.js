const mongoose = require("mongoose");

const VoterLogSchema = new mongoose.Schema(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },
    voterToken: String,
    fingerprint: String,
    voterAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const VoterLog = mongoose.model("VoterLog", VoterLogSchema, "voter_logs");
module.exports = VoterLog;
