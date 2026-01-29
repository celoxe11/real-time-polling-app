const express = require("express");
const router = express.Router();

const {
  cleanUpUnverifiedUsers,
  getAllUsers,
  deleteUser,
  getAllPolls,
  deletePoll,
} = require("../controllers/adminController");
const { verifyFirebaseToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

router.delete(
  "/clean-up-unverified-users",
  verifyFirebaseToken,
  isAdmin,
  cleanUpUnverifiedUsers,
);

router.get("/users", verifyFirebaseToken, isAdmin, getAllUsers);
router.delete("/users/:id", verifyFirebaseToken, isAdmin, deleteUser);

router.get("/polls", verifyFirebaseToken, isAdmin, getAllPolls);
router.delete("/polls/:id", verifyFirebaseToken, isAdmin, deletePoll);

module.exports = router;
