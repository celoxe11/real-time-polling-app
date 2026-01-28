const express = require("express");
const router = express.Router();
const {
  verifyFirebaseToken,
  optionalAuth,
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
router.post("/", verifyFirebaseToken, createPoll);
router.put("/:id", verifyFirebaseToken, updatePoll);
router.delete("/:id", verifyFirebaseToken, deletePoll);
router.post("/:id/vote", optionalAuth, votePoll);

module.exports = router;
