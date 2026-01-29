const { auth } = require("../config/firebase");
const User = require("../models/User");

// Verify dan simpan user ke database
const verifyAndSaveUser = async (req, res) => {
  try {
    // User data is already synced and attached to req.user by verifyFirebaseToken middleware
    res.status(200).json({
      success: true,
      message: "User authenticated",
      user: req.user,
    });
  } catch (error) {
    console.error("Error in verifyAndSaveUser:", error);
    res.status(500).json({
      success: false,
      message: "Failed to return user data",
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
        role: user.role,
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

const editProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { name, photoURL } = req.body;
    // Update user profile in Firebase Authentication
    await auth.updateUser(uid, {
      displayName: name,
      photoURL: photoURL,
    });

    // Get updated user
    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { name: name, photoURL: photoURL },
      { new: true },
    );

    return res.status(200).json({
      id: updatedUser._id,
      firebaseUid: updatedUser.firebaseUid,
      email: updatedUser.email,
      name: updatedUser.name,
      photoURL: updatedUser.photoURL,
      role: updatedUser.role,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  verifyAndSaveUser,
  getCurrentUser,
  deleteUser,
  editProfile,
};
