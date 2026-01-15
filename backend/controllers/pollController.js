const Poll = require("../models/Poll");

const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find({}).populate("createdBy", "name photoURL");
    return res.status(200).json(polls);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getMyPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ createdBy: req.user.id });

    // Filter using virtual status field
    const activePolls = polls.filter((poll) => poll.status === "active");
    const closedPolls = polls.filter((poll) => poll.status === "closed");

    return res.status(200).json({
      myPolls: polls,
      activePolls: activePolls,
      closedPolls: closedPolls,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const createPoll = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      isPublic,
      hasTimeLimit,
      timeLimit,
      timeLimitUnit,
      question,
      options,
    } = req.body;

    const endTime = hasTimeLimit
      ? new Date(
          Date.now() +
            timeLimit *
              (timeLimitUnit === "hours"
                ? 60 * 60 * 1000
                : timeLimitUnit === "days"
                ? 24 * 60 * 60 * 1000
                : 7 * 24 * 60 * 60 * 1000)
        )
      : null;

    // generate 8 digit number for room code
    const roomCode = Math.floor(10000000 + Math.random() * 90000000);

    const createdBy = req.user.id;

    const poll = await Poll.create({
      title,
      description,
      category,
      isPublic,
      hasTimeLimit,
      endTime,
      roomCode,
      createdBy,
      question,
      options,
    });
    return res.status(201).json(poll);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const updatePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      isPublic,
      hasTimeLimit,
      timeLimit,
      timeLimitUnit,
      question,
      options,
    } = req.body;
    const poll = await Poll.findByIdAndUpdate(id, {
      title,
      description,
      category,
      isPublic,
      hasTimeLimit,
      timeLimit,
      timeLimitUnit,
      question,
      options,
    });
    return res.status(200).json(poll);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const deletePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const poll = await Poll.findByIdAndDelete(id);
    return res.status(200).json(poll);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getPollById = async (req, res) => {
  try {
    const { id } = req.params;
    const poll = await Poll.findById(id).populate("createdBy", "name photoURL");
    return res.status(200).json(poll);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const votePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const { option } = req.body;
    const poll = await Poll.findByIdAndUpdate(id, {
      $inc: { [`options.${option}.votes`]: 1 },
    });
    return res.status(200).json(poll);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getTrendingPolls = async (req, res) => {
  // Polls yang sedang "hot" - banyak aktivitas dalam waktu dekat
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Calculate trending score based on:
    // - Recent votes (last 24-48 hours)
    // - Vote velocity (votes per hour)
    // - Recency (newer polls get boost)

    /**
     * Poll A: 100 votes in 10 hours = 10 votes/hour ⭐ Most trending
     * Poll B: 50 votes in 2 hours = 25 votes/hour ⭐⭐ SUPER trending!
     * Poll C: 200 votes in 48 hours = 4.2 votes/hour ⭐⭐⭐ Trending
     */

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const polls = await Poll.aggregate([
      {
        $match: {
          isPublic: true,
          status: "active", // Only active polls
          createdAt: { $gte: oneDayAgo }, // Created in last 24h
        },
      },
      {
        $addFields: {
          totalVotes: {
            $sum: "$options.votes",
          },
          // Calculate hours since creation
          hoursOld: {
            $divide: [
              { $subtract: [new Date(), "$createdAt"] },
              1000 * 60 * 60,
            ],
          },
        },
      },
      {
        $addFields: {
          // Trending score = votes per hour (Total Votes / Hours Since Creation)
          trendingScore: {
            $cond: {
              if: { $gt: ["$hoursOld", 0] },
              then: { $divide: ["$totalVotes", "$hoursOld"] },
              else: 0,
            },
          },
        },
      },
      {
        $sort: { trendingScore: -1 },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $unwind: {
          path: "$creator",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          id: "$_id",
          status: {
            $cond: {
              if: {
                $or: [
                  { $eq: ["$hasTimeLimit", false] },
                  { $eq: ["$endTime", null] },
                  { $gt: ["$endTime", new Date()] },
                ],
              },
              then: "active",
              else: "closed",
            },
          },
          "creator.name": "$creator.name",
          "creator.photoURL": "$creator.photoURL",
        },
      },
    ]);

    return res.status(200).json(polls);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getRecentPolls = async (req, res) => {
  // Newest polls, sorted by creation date
  try {
    const limit = parseInt(req.query.limit) || 10;

    const polls = await Poll.find({
      isPublic: true,
      status: "active",
    })
      .sort({ createdAt: -1 }) // Newest first
      .limit(limit)
      .populate("createdBy", "name photoURL") // Include creator info
      .lean();

    // Add total votes to each poll
    const pollsWithVotes = polls.map((poll) => ({
      ...poll,
      totalVotes: poll.options.reduce((sum, opt) => sum + opt.votes, 0),
    }));

    return res.status(200).json(pollsWithVotes);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getPopularPolls = async (req, res) => {
  // Polls with most total votes (all-time)
  try {
    const limit = parseInt(req.query.limit) || 10;

    const polls = await Poll.aggregate([
      {
        $match: {
          isPublic: true,
          // Include both active and closed polls
        },
      },
      {
        $addFields: {
          totalVotes: {
            $sum: "$options.votes",
          },
        },
      },
      {
        $sort: { totalVotes: -1 }, // Most votes first
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $unwind: {
          path: "$creator",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          id: "$_id",
          title: 1,
          description: 1,
          category: 1,
          options: 1,
          totalVotes: 1,
          status: 1,
          createdAt: 1,
          "creator.name": 1,
          "creator.photoURL": 1,
        },
      },
    ]);

    return res.status(200).json(polls);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const searchPolls = async (req, res) => {
  try {
    const { query } = req.query;
    const polls = await Poll.find({ title: { $regex: query, $options: "i" } });
    return res.status(200).json(polls);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getPollByRoomCode = async (req, res) => {
  try {
    const { roomCode } = req.params;
    const poll = await Poll.findOne({ roomCode });
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }
    return res.status(200).json(poll);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPolls,
  getMyPolls,
  createPoll,
  updatePoll,
  deletePoll,
  getPollById,
  votePoll,
  getTrendingPolls,
  getRecentPolls,
  getPopularPolls,
  searchPolls,
  getPollByRoomCode,
};
