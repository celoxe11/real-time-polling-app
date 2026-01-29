const { auth } = require("../config/firebase");
const User = require("../models/User");
const mongoose = require("mongoose");
require("dotenv").config();

/**
 * User Seeder
 * Fetches users from Firebase Authentication and syncs them to MongoDB
 */

const seedUsersFromFirebase = async (skipExit = false) => {
  try {
    console.log("🔄 Starting user seeder from Firebase...");

    // Connect to MongoDB only if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ Connected to MongoDB");
    }

    // Get all users from Firebase
    const listUsersResult = await auth.listUsers(1000); // Max 1000 users
    const firebaseUsers = listUsersResult.users;

    console.log(`📊 Found ${firebaseUsers.length} users in Firebase`);

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const firebaseUser of firebaseUsers) {
      try {
        // Check if user already exists in MongoDB
        const existingUser = await User.findOne({
          firebaseUid: firebaseUser.uid,
        });

        if (existingUser) {
          // Update existing user
          existingUser.email = firebaseUser.email;
          existingUser.name =
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            "Anonymous";
          existingUser.photoURL = firebaseUser.photoURL || null;
          existingUser.lastLogin = new Date();

          await existingUser.save();
          updated++;
          console.log(`✏️  Updated: ${firebaseUser.email}`);
        } else {
          // Create new user
          const newUser = await User.create({
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            name:
              firebaseUser.displayName ||
              firebaseUser.email?.split("@")[0] ||
              "Anonymous",
            photoURL: firebaseUser.photoURL || null,
            role: firebaseUser.email == "admin@admin.com" ? "admin" : "user",
            createdAt: new Date(firebaseUser.metadata.creationTime),
            lastLogin: new Date(),
          });

          created++;
          console.log(`✅ Created: ${firebaseUser.email}`);
        }
      } catch (error) {
        skipped++;
        console.error(
          `❌ Error processing ${firebaseUser.email}:`,
          error.message,
        );
      }
    }

    console.log("\n📊 Seeding Summary:");
    console.log(`   ✅ Created: ${created} users`);
    console.log(`   ✏️  Updated: ${updated} users`);
    console.log(`   ❌ Skipped: ${skipped} users`);
    console.log(`   📊 Total: ${firebaseUsers.length} users processed`);

    if (!skipExit) {
      await mongoose.connection.close();
      console.log("\n✅ User seeding completed!");
      process.exit(0);
    } else {
      console.log("\n✅ User seeding completed!");
    }
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    if (!skipExit) {
      await mongoose.connection.close();
      process.exit(1);
    } else {
      throw error;
    }
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedUsersFromFirebase();
}

module.exports = { seedUsersFromFirebase };
