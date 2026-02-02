const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/authMiddleware");
const {
  verifyAndSaveUser,
  getCurrentUser,
  deleteUser,
  editProfile,
} = require("../controllers/authController");

// Sync user (dipanggil saat login/register - tidak perlu middleware karena verify dilakukan di controller)
router.post("/verify", verifyAndSaveUser);

// Protected routes - memerlukan authentication
router.get("/me", verifyFirebaseToken, getCurrentUser);
router.post("/edit-profile", verifyFirebaseToken, editProfile);
router.delete("/delete", verifyFirebaseToken, deleteUser);

module.exports = router;
