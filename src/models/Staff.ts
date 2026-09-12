import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GymBranch",
    },
    name: { type: String, required: true },
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
    payment: String,
    salary: Number,
    role: {
      type: String,
      enum: ["ADMIN", "MANAGER", "STAFF", "ACCOUNTANT", "RECEPTIONIST"],
      default: "STAFF",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Staff || mongoose.model("Staff", StaffSchema);
