const { auth } = require("../config/firebase");
const User = require("../models/User");

// Verify dan simpan user ke database
const verifyAndSaveUser = async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user;

    // Cek apakah user sudah ada di database
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // Buat user baru jika belum ada
      user = new User({
        firebaseUid: uid,
        email: email,
        name: name,
        photoURL: picture,
      });
      await user.save();
    } else {
      // Update info user jika sudah ada
      user.name = name || user.name;
      user.photoURL = picture || user.photoURL;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "User authenticated",
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name,
        photoURL: user.photoURL,
      },
    });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save user",
      error: error.message,
    });
  }
};

// Get current user info
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name,
        photoURL: user.photoURL,
      },
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user",
      error: error.message,
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { uid } = req.user;

    // Hapus dari Firebase
    await auth.deleteUser(uid);

    // Hapus dari database
    await User.deleteOne({ firebaseUid: uid });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

module.exports = {
  verifyAndSaveUser,
  getCurrentUser,
  deleteUser,
};
