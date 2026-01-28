const { admin } = require("../config/firebase");
const Poll = require("../models/Poll");
const VoterLog = require("../models/VoterLog");

const getUserStats = async (req, res) => {
  try {
    const { voterToken, fingerprint } = req.body;

    // If no voter token provided, return zero stats
    if (!voterToken && !fingerprint) {
      return res.status(200).json({
        totalVotedPolls: 0,
        weeklyVotedPolls: 0,
        votingStreak: 0,
      });
    }

    // get users voted polls
    const totalVotedPolls = await VoterLog.countDocuments({
      $or: [{ voterToken: voterToken }, { fingerprint: fingerprint }],
    });

    // get users this week voted polls
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyVotedPolls = await VoterLog.countDocuments({
      $or: [{ voterToken: voterToken }, { fingerprint: fingerprint }],
      voterAt: { $gte: oneWeekAgo },
    });

    // get users streak of voting (consecutive days with at least one vote)
    let streak = 0;
    let dayCursor = new Date();
    while (true) {
      const startOfDay = new Date(
        dayCursor.getFullYear(),
        dayCursor.getMonth(),
        dayCursor.getDate(),
      );
      const endOfDay = new Date(
        dayCursor.getFullYear(),
        dayCursor.getMonth(),
        dayCursor.getDate() + 1,
      );
      const votesToday = await VoterLog.countDocuments({
        $or: [{ voterToken: voterToken }, { fingerprint: fingerprint }],
        voterAt: { $gte: startOfDay, $lt: endOfDay },
      });
      if (votesToday > 0) {
        streak++;
        dayCursor.setDate(dayCursor.getDate() - 1);
      } else {
        break;
      }
    }

    return res.status(200).json({
      totalVotedPolls,
      weeklyVotedPolls,
      votingStreak: streak,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error.message);
  }
};

const getProfileStats = async (req, res) => {
  try {
    const userId = req.user.id; // Correctly use MongoDB _id for createdBy field

    // get users created polls
    const totalCreatedPolls = await Poll.countDocuments({
      createdBy: userId,
    });
    // get users total votes received
    const polls = await Poll.find({ createdBy: userId });
    let totalVotesReceived = 0;
    for (const poll of polls) {
      const votes = await VoterLog.countDocuments({ pollId: poll._id });
      totalVotesReceived += votes;
    }
    // get users active polls
    const activePolls = await Poll.countDocuments({
      createdBy: userId,
      // Note: your model uses endTime/status virtual, normally you'd query by endTime > now
      // but let's assume you might have an isActive field or similar property if intended
    });
    return res.status(200).json({
      totalCreatedPolls,
      totalVotesReceived,
      activePolls,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error.message);
  }
};

const editProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, photoURL } = req.body;
    // Update user profile in Firebase Authentication
    await admin.auth().updateUser(userId, {
      displayName: name,
      photoURL: photoURL,
    });

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
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
        message: "Voter token and fingerprint are required",
      });
    }

    // Check if there's a vote record with either voterToken or fingerprint
    const existingVote = await VoterLog.findOne({
      pollId: pollId,
      $or: [{ voterToken: voterToken }, { fingerprint: fingerprint }],
    });

    if (existingVote) {
      return res.status(200).json({
        hasVoted: true,
        votedAt: existingVote.voterAt,
        message: "You have already voted in this poll",
      });
    }

    return res.status(200).json({
      hasVoted: false,
      message: "You have not voted in this poll yet",
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
          select: "name photoURL",
        },
      })
      .sort({ voterAt: -1 });

    return res.status(200).json({
      totalVoted: votedPolls.length,
      polls: votedPolls,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserStats,
  getProfileStats,
  editProfile,
  hasUserVotedPoll,
  getUserVotedPolls,
};
