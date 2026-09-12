import mongoose from "mongoose";

const MemberAchievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  achievementId: { type: mongoose.Schema.Types.ObjectId, ref: "Achievement" },
  achievedAt: { type: Date, default: Date.now },
});

export default mongoose.models.MemberAchievement ||
  mongoose.model("MemberAchievement", MemberAchievementSchema);