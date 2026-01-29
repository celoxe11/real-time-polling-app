const { admin } = require("../config/firebase");
const User = require("../models/User");

const cleanUpUnverifiedUsers = async (req, res) => {
  try {
    // Clear users that are not verified for 14 days
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - 14);

    const users = await admin.auth().listUsers();
    const unverifiedUsers = users.users.filter(
      (user) => !user.emailVerified && user.metadata.createdAt < expirationDate,
    );

    // delete user from firebase auth
    for (const user of unverifiedUsers) {
      await admin.auth().deleteUser(user.uid);
    }

    // delete user from mongodb
    for (const user of unverifiedUsers) {
      await User.deleteOne({ firebaseUid: user.uid });
    }

    return res.status(201).json({
      success: true,
      message: "Unverified users cleaned up successfully",
    });
  } catch (error) {
    console.error("Error cleaning up unverified users:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clean up unverified users",
      error: error.message,
    });
  }
};

module.exports = {
  cleanUpUnverifiedUsers,
};
