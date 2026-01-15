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

// Virtual field for poll status
PollSchema.virtual("status").get(function () {
  // If poll doesn't have time limit, it's always active
  if (!this.hasTimeLimit || !this.endTime) {
    return "active";
  }

  // Compare endTime with current time
  const now = new Date();
  const endTime = new Date(this.endTime);

  return now > endTime ? "closed" : "active";
});

// Virtual field for id (alias for _id)
PollSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Virtual field for totalVotes
PollSchema.virtual("totalVotes").get(function () {
  if (!this.options || this.options.length === 0) {
    return 0;
  }
  return this.options.reduce((sum, option) => sum + (option.votes || 0), 0);
});

// Ensure virtuals are included when converting to JSON
PollSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    // Remove __v
    delete ret.__v;
    return ret;
  },
});

// Ensure virtuals are included when converting to Object
PollSchema.set("toObject", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Poll", PollSchema, "polls");
