const Poll = require("../models/Poll");

const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find({});
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
    const poll = await Poll.findById(id);
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

const getTrendingPolls = async (req, res) => {};

const getRecentPolls = async (req, res) => {};

const getPopularPolls = async (req, res) => {};

const searchPolls = async (req, res) => {};

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
};
