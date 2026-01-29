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

    // Sanitize name input
    const sanitizeName = (name) => {
      if (!name) return null;
      return name.replace(/[<>]/g, "").trim().substring(0, 100);
    };

    const userName =
      sanitizeName(decodedToken.name) || decodedToken.email.split("@")[0];

    // Use atomic upsert to prevent race conditions
    let user = await User.findOneAndUpdate(
      { firebaseUid: decodedToken.uid },
      {
        $set: {
          lastLogin: new Date(),
          email: decodedToken.email,
          name: decodedToken.name || userName,
          photoURL: decodedToken.picture || null,
        },
        $setOnInsert: {
          firebaseUid: decodedToken.uid,
          role: "user",
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    );

    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Failed to create or retrieve user account",
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
