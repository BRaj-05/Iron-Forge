import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GymBranch",
    },

    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
    },

    membershipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
    },

    contactNo: {
      type: String,
      trim: true,
    },
    age: Number,
    gender: String,
    address: String,
    healthIssues: String,
    problems: String,
    emergencyContact: String,
    emergency_contact: String,

    xp: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 1,
    },

    streak: {
      type: Number,
      default: 0,
    },

    membershipStatus: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "FROZEN"],
      default: "ACTIVE",
    },

    joinDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Member ||
  mongoose.model("Member", MemberSchema);
