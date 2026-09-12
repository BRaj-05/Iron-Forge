import mongoose from "mongoose";

const MembershipSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GymBranch",
    },
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    features: String,
    active: {
      type: Boolean,
      default: true,
    },
    imageUrl: String,
    imagePublicId: String,
  },
  { timestamps: true }
);

export default mongoose.models.Membership ||
  mongoose.model("Membership", MembershipSchema);
