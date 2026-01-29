const express = require("express");
const router = express.Router();
const {
  verifyFirebaseToken,
  optionalAuth,
  ensureEmailVerified,
} = require("../middleware/authMiddleware");

const {
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
} = require("../controllers/pollController");

router.get("/", verifyFirebaseToken, getPolls);
router.get("/my-polls", verifyFirebaseToken, getMyPolls);
router.get("/trending", optionalAuth, getTrendingPolls);
router.get("/recent", optionalAuth, getRecentPolls);
router.get("/popular", optionalAuth, getPopularPolls);
router.get("/search", optionalAuth, searchPolls);
router.get("/room/:roomCode", optionalAuth, getPollByRoomCode);
router.get("/:id", optionalAuth, getPollById);
router.post("/", verifyFirebaseToken, ensureEmailVerified, createPoll);
router.put("/:id", verifyFirebaseToken, ensureEmailVerified, updatePoll);
router.delete("/:id", verifyFirebaseToken, ensureEmailVerified, deletePoll);
router.post("/:id/vote", optionalAuth, votePoll);

module.exports = router;
