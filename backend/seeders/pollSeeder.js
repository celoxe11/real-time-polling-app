const Poll = require("../models/Poll");
const User = require("../models/User");
const mongoose = require("mongoose");
require("dotenv").config();

/**
 * Poll Seeder
 * Creates sample polls for testing and development
 */

const samplePolls = [
  {
    title: "What's your favorite programming language?",
    description: "Vote for the programming language you use most often",
    category: "technology",
    isPublic: true,
    hasTimeLimit: false,
    options: [
      { optionText: "JavaScript", votes: 45 },
      { optionText: "Python", votes: 38 },
      { optionText: "Java", votes: 22 },
      { optionText: "C++", votes: 15 },
      { optionText: "Go", votes: 12 },
    ],
  },
  {
    title: "Best time for team meetings?",
    description: "Help us decide the optimal time for weekly sync",
    category: "work",
    isPublic: true,
    hasTimeLimit: true,
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    options: [
      { optionText: "9:00 AM", votes: 12 },
      { optionText: "10:00 AM", votes: 28 },
      { optionText: "2:00 PM", votes: 35 },
      { optionText: "4:00 PM", votes: 8 },
    ],
  },
  {
    title: "Favorite streaming platform?",
    description: "Which streaming service do you use most?",
    category: "entertainment",
    isPublic: true,
    hasTimeLimit: false,
    options: [
      { optionText: "Netflix", votes: 67 },
      { optionText: "Disney+", votes: 34 },
      { optionText: "Amazon Prime", votes: 28 },
      { optionText: "HBO Max", votes: 19 },
      { optionText: "YouTube Premium", votes: 42 },
    ],
  },
  {
    title: "Remote work vs Office?",
    description: "What's your preferred work environment?",
    category: "work",
    isPublic: true,
    hasTimeLimit: false,
    options: [
      { optionText: "Fully Remote", votes: 89 },
      { optionText: "Hybrid (2-3 days office)", votes: 56 },
      { optionText: "Fully Office", votes: 12 },
      { optionText: "Flexible (my choice)", votes: 43 },
    ],
  },
  {
    title: "Best pizza topping?",
    description: "The ultimate pizza debate",
    category: "food",
    isPublic: true,
    hasTimeLimit: false,
    options: [
      { optionText: "Pepperoni", votes: 78 },
      { optionText: "Mushrooms", votes: 34 },
      { optionText: "Pineapple 🍍", votes: 23 },
      { optionText: "Extra Cheese", votes: 56 },
      { optionText: "Vegetables", votes: 19 },
    ],
  },
  {
    title: "Preferred learning method?",
    description: "How do you learn new skills best?",
    category: "education",
    isPublic: true,
    hasTimeLimit: false,
    options: [
      { optionText: "Video tutorials", votes: 67 },
      { optionText: "Reading documentation", votes: 34 },
      { optionText: "Hands-on projects", votes: 89 },
      { optionText: "Online courses", votes: 45 },
      { optionText: "Bootcamps", votes: 12 },
    ],
  },
  {
    title: "Morning person or night owl?",
    description: "When are you most productive?",
    category: "lifestyle",
    isPublic: true,
    hasTimeLimit: true,
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    options: [
      { optionText: "Early morning (5-8 AM)", votes: 34 },
      { optionText: "Late morning (9-12 PM)", votes: 56 },
      { optionText: "Afternoon (1-5 PM)", votes: 28 },
      { optionText: "Evening (6-10 PM)", votes: 45 },
      { optionText: "Night (11 PM - 2 AM)", votes: 37 },
    ],
  },
  {
    title: "Favorite sport to watch?",
    description: "Which sport do you enjoy watching most?",
    category: "sports",
    isPublic: true,
    hasTimeLimit: false,
    options: [
      { optionText: "Football/Soccer ⚽", votes: 89 },
      { optionText: "Basketball 🏀", votes: 67 },
      { optionText: "Tennis 🎾", votes: 23 },
      { optionText: "Formula 1 🏎️", votes: 45 },
      { optionText: "Cricket 🏏", votes: 34 },
    ],
  },
  {
    title: "Coffee or Tea?",
    description: "The eternal beverage debate",
    category: "food",
    isPublic: true,
    hasTimeLimit: false,
    options: [
      { optionText: "Coffee ☕", votes: 123 },
      { optionText: "Tea 🍵", votes: 78 },
      { optionText: "Both!", votes: 45 },
      { optionText: "Neither", votes: 12 },
    ],
  },
  {
    title: "AI will replace developers?",
    description: "What do you think about AI in software development?",
    category: "technology",
    isPublic: true,
    hasTimeLimit: true,
    endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    options: [
      { optionText: "Yes, eventually", votes: 23 },
      { optionText: "No, never", votes: 67 },
      { optionText: "It will augment, not replace", votes: 89 },
      { optionText: "Unsure", votes: 21 },
    ],
  },
];

const generateRoomCode = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

const seedPolls = async (skipExit = false) => {
  try {
    console.log("🔄 Starting poll seeder...");

    // Connect to MongoDB only if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ Connected to MongoDB");
    }

    // Get all users to assign as creators
    const users = await User.find();

    if (users.length === 0) {
      console.log("⚠️  No users found in database!");
      console.log("💡 Please run userSeeder first: node seeders/userSeeder.js");
      if (!skipExit) {
        await mongoose.connection.close();
        process.exit(1);
      } else {
        throw new Error("No users found in database");
      }
    }

    console.log(`📊 Found ${users.length} users in database`);

    // Clear existing polls (optional)
    const shouldClear = process.argv.includes("--clear");
    if (shouldClear) {
      await Poll.deleteMany({});
      console.log("🗑️  Cleared existing polls");
    }

    let created = 0;
    let failed = 0;

    for (const pollData of samplePolls) {
      try {
        // Randomly assign a creator
        const randomUser = users[Math.floor(Math.random() * users.length)];

        // Create poll with random creation time (last 30 days)
        const daysAgo = Math.floor(Math.random() * 30);
        const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

        const poll = await Poll.create({
          ...pollData,
          roomCode: generateRoomCode(),
          createdBy: randomUser._id,
          createdAt: createdAt,
          updatedAt: createdAt,
        });

        created++;
        console.log(
          `✅ Created: "${poll.title}" (${poll.options.length} options)`
        );
      } catch (error) {
        failed++;
        console.error(`❌ Error creating poll:`, error.message);
      }
    }

    console.log("\n📊 Seeding Summary:");
    console.log(`   ✅ Created: ${created} polls`);
    console.log(`   ❌ Failed: ${failed} polls`);
    console.log(`   📊 Total: ${samplePolls.length} polls processed`);

    if (!skipExit) {
      await mongoose.connection.close();
      console.log("\n✅ Poll seeding completed!");
      process.exit(0);
    } else {
      console.log("\n✅ Poll seeding completed!");
    }
  } catch (error) {
    console.error("❌ Error seeding polls:", error);
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
  seedPolls();
}

module.exports = { seedPolls };
