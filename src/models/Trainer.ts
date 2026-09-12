import mongoose from "mongoose";

const TrainerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GymBranch",
    },
    name: String,
    contactNo: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    specialization: String,
    experience: Number,
    salary: Number,
    availability: {
      type: Boolean,
      default: true,
    },
    imageUrl: String,
    imagePublicId: String,
    rating: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Trainer ||
  mongoose.model("Trainer", TrainerSchema);
