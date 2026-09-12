const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI not found in .env.local");
  process.exit(1);
}

// Simple User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  emailVerified: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);

    const existingAdmin = await User.findOne({ email: "admin@gym.com" });

    if (existingAdmin) {
      if (!existingAdmin.emailVerified) {
        existingAdmin.emailVerified = true;
        await existingAdmin.save();
        console.log("Admin already exists. Email verification enabled.");
      } else {
        console.log("Admin already exists.");
      }
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Super Admin",
      email: "admin@gym.com",
      password: hashedPassword,
      role: "ADMIN",
      emailVerified: true,
    });

    console.log("Admin created successfully.");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

createAdmin();
