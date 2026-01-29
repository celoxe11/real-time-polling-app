const express = require("express");
const router = express.Router();

const { cleanUpUnverifiedUsers } = require("../controllers/adminController");
const { verifyFirebaseToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

router.delete(
  "/clean-up-unverified-users",
  verifyFirebaseToken,
  isAdmin,
  cleanUpUnverifiedUsers,
);

module.exports = router;
