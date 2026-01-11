const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/authMiddleware");
const {
  verifyAndSaveUser,
  getCurrentUser,
  deleteUser,
} = require("../controllers/authController");

// Protected routes - memerlukan authentication
router.post("/verify", verifyFirebaseToken, verifyAndSaveUser);
router.get("/me", verifyFirebaseToken, getCurrentUser);
router.delete("/delete", verifyFirebaseToken, deleteUser);

module.exports = router;
