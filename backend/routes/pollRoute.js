const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/authMiddleware");

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
router.get("/trending", verifyFirebaseToken, getTrendingPolls);
router.get("/recent", verifyFirebaseToken, getRecentPolls);
router.get("/popular", verifyFirebaseToken, getPopularPolls);
router.get("/search", verifyFirebaseToken, searchPolls);
router.get("/room/:roomCode", verifyFirebaseToken, getPollByRoomCode);
router.get("/:id", verifyFirebaseToken, getPollById);
router.post("/", verifyFirebaseToken, createPoll);
router.put("/:id", verifyFirebaseToken, updatePoll);
router.delete("/:id", verifyFirebaseToken, deletePoll);
router.post("/:id/vote", verifyFirebaseToken, votePoll);

module.exports = router;
