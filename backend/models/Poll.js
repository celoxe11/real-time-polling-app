// model untuk poll
const mongoose = require("mongoose");

const PollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    isPublic: {
      type: Boolean,
    },
    hasTimeLimit: {
      type: Boolean,
    },
    endTime: {
      type: Date,
    },
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
    },
    options: [
      {
        optionText: {
          type: String,
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
