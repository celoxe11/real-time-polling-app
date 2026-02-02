const { auth } = require("../config/firebase");
const User = require("../models/User");

// Middleware untuk verifikasi Firebase ID Token
const verifyFirebaseToken = async (req, res, next) => {
  try {
    // Ambil token dari header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const idToken = authHeader.split("Bearer ")[1];

    // Verifikasi token dengan Firebase Admin
    const decodedToken = await auth.verifyIdToken(idToken);

    // Validate email
    if (!decodedToken.email || !decodedToken.email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    // Find user in database (no upsert here to avoid overhead)
    const user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please complete registration first.",
        code: "USER_NOT_FOUND",
      });
    }

    // Attach user info ke request
    req.user = {
      id: user._id.toString(),
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: user.name,
      photoURL: user.photoURL || decodedToken.picture || null,
      emailVerified: decodedToken.email_verified,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);

    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    if (error.code === "auth/argument-error") {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// Middleware optional (tidak wajib login)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const idToken = authHeader.split("Bearer ")[1];
      const decodedToken = await auth.verifyIdToken(idToken);

      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        photoURL: decodedToken.picture,
      };
    }

    next();
  } catch (error) {
    // Jika error, tetap lanjut tanpa user
    next();
  }
};

const ensureEmailVerified = (req, res, next) => {
  // We check req.user because your previous middleware already attached it
  if (!req.user || !req.user.emailVerified) {
    return res.status(403).json({
      success: false,
      message:
        "Your email is not verified. Please verify your email to access this feature.",
    });
  }
  next();
};

module.exports = {
  verifyFirebaseToken,
  optionalAuth,
  ensureEmailVerified,
};
