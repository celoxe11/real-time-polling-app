const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/authMiddleware");

const {
  getUserStats,
  hasUserVotedPoll,
  getUserVotedPolls,
} = require("../controllers/userController");

router.get("/stats", verifyFirebaseToken, getUserStats);

// Check if user has voted in a specific poll (no auth required for anonymous users)
router.post("/has-voted/:pollId", hasUserVotedPoll);

// Get all polls that user has voted in (no auth required for anonymous users)
router.post("/voted-polls", getUserVotedPolls);

module.exports = router;
