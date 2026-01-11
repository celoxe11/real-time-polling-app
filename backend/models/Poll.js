// model untuk poll
const mongoose = require("mongoose");

const PollSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: [
      {
        optionText: {
          type: String,
          required: true,
        },
        votes: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Poll", PollSchema, "polls");
