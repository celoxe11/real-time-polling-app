const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/authMiddleware");

const { getUserStats } = require("../controllers/userController");

router.get("/stats", verifyFirebaseToken, getUserStats);

module.exports = router;
