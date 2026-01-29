const { admin } = require("../config/firebase");
const User = require("../models/User");
const Poll = require("../models/Poll");

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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).lean();

    // query to firebase for last sign in.
    const firebaseUsers = await admin.auth().listUsers();
    const usersWithLastSignIn = users.map((user) => {
      const firebaseUser = firebaseUsers.users.find(
        (fu) => fu.uid === user.firebaseUid,
      );
      return {
        ...user,
        lastSignInTime: firebaseUser?.metadata?.lastSignInTime,
      };
    });

    return res.status(200).json(usersWithLastSignIn);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete from Firebase Auth
    await admin.auth().deleteUser(user.firebaseUid);

    // Delete from MongoDB
    await User.findByIdAndDelete(id);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find({})
      .populate("createdBy", "name email photoURL")
      .sort({ createdAt: -1 });
    return res.status(200).json(polls);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deletePoll = async (req, res) => {
  try {
    const { id } = req.params;
    await Poll.findByIdAndDelete(id);
    return res.status(200).json({ message: "Poll deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  cleanUpUnverifiedUsers,
  getAllUsers,
  deleteUser,
  getAllPolls,
  deletePoll,
};
