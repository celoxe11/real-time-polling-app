const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {
  login,
  register,
  logout,
  gooleSignIn,
} = require("../controllers/authController");

// Route untuk login
router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);
router.post("/google-signin", gooleSignIn);

module.exports = router;
