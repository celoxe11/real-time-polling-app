const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/authMiddleware");
const {
  verifyAndSaveUser,
  getCurrentUser,
  deleteUser,
  editProfile,
} = require("../controllers/authController");

// Protected routes - memerlukan authentication
router.post("/verify", verifyFirebaseToken, verifyAndSaveUser);
router.get("/me", verifyFirebaseToken, getCurrentUser);
router.post("/edit-profile", verifyFirebaseToken, editProfile);
router.delete("/delete", verifyFirebaseToken, deleteUser);

module.exports = router;
