import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

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

    lastCompletedDate: {
      type: Date,
    },

    badges: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.UserProgress ||
  mongoose.model("UserProgress", progressSchema);