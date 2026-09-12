import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema({
  title: String,
  description: String,
  points: Number,
  badgeIcon: String,
});

export default mongoose.models.Achievement ||
  mongoose.model("Achievement", AchievementSchema);