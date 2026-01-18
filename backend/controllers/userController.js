const VoterLog = require("../models/VoterLog");

const getUserStats = async (req, res) => {
  try {
    // get users voted polls
    // get users
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error.message);
  }
};

/**
 * Check if user has voted in a specific poll
 * Uses two-layer verification: voterToken OR fingerprint
 */
const hasUserVotedPoll = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { voterToken, fingerprint } = req.body;

    if (!voterToken || !fingerprint) {
      return res.status(400).json({ 
        message: "Voter token and fingerprint are required" 
      });
    }

    // Check if there's a vote record with either voterToken or fingerprint
    const existingVote = await VoterLog.findOne({
      pollId: pollId,
      $or: [
        { voterToken: voterToken },
        { fingerprint: fingerprint }
      ]
    });

    if (existingVote) {
      return res.status(200).json({
        hasVoted: true,
        votedAt: existingVote.voterAt,
        message: "You have already voted in this poll"
      });
    }

    return res.status(200).json({
      hasVoted: false,
      message: "You have not voted in this poll yet"
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get all polls that a user has voted in
 */
const getUserVotedPolls = async (req, res) => {
  try {
    const { voterToken } = req.body;

    if (!voterToken) {
      return res.status(400).json({ message: "Voter token is required" });
    }

    const votedPolls = await VoterLog.find({ voterToken })
      .populate({
        path: "pollId",
        select: "title description category createdAt",
        populate: {
          path: "createdBy",
          select: "name photoURL"
        }
      })
      .sort({ voterAt: -1 });

    return res.status(200).json({
      totalVoted: votedPolls.length,
      polls: votedPolls
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserStats, hasUserVotedPoll, getUserVotedPolls };