import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    deadline: {
      type: Date,
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    important: {
      type: Boolean,
      default: false,
    },

    recurring: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "MISSED"],
      default: "PENDING",
    },

    xpEarned: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Todo ||
  mongoose.model("Todo", todoSchema);