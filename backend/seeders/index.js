const { seedUsersFromFirebase } = require("./userSeeder");
const { seedPolls } = require("./pollSeeder");
const mongoose = require("mongoose");
require("dotenv").config();

/**
 * Master Seeder
 * Runs all seeders in the correct order
 */

const runAllSeeders = async () => {
  console.log("🚀 Starting all seeders...\n");

  try {
    // Connect to MongoDB once
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // 1. Seed users from Firebase first
    console.log("=".repeat(50));
    console.log("STEP 1: Seeding Users from Firebase");
    console.log("=".repeat(50));
    await seedUsersFromFirebase(true); // skipExit = true

    // 2. Seed polls
    console.log("\n" + "=".repeat(50));
    console.log("STEP 2: Seeding Polls");
    console.log("=".repeat(50));
    await seedPolls(true); // skipExit = true

    // Close connection
    await mongoose.connection.close();

    console.log("\n" + "=".repeat(50));
    console.log("✅ ALL SEEDERS COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(50));
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeder failed:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runAllSeeders();
}

module.exports = { runAllSeeders };
