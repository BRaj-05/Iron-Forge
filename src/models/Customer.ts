import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true,
    },
    name: { type: String, required: true },
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
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
    membership: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GymBranch",
    },
    age: Number,
    gender: String,
    problems: String,
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
    },
    address: String,
    emergencyContact: String,
    avatarUrl: String,
    avatarPublicId: String,
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Customer ||
  mongoose.model("Customer", CustomerSchema);
