import mongoose from "mongoose";

const GymBranchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: String,
    city: String,
    phone: String,
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    imageUrl: String,
    imagePublicId: String,
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.GymBranch ||
  mongoose.model("GymBranch", GymBranchSchema);
