import mongoose from "mongoose";

const AdminProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    branchAccess: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GymBranch",
      },
    ],
    permissions: [
      {
        type: String,
      },
    ],
    canManagePayments: {
      type: Boolean,
      default: true,
    },
    canManageStaff: {
      type: Boolean,
      default: true,
    },
    canManageEquipment: {
      type: Boolean,
      default: true,
    },
    canManageReports: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.AdminProfile ||
  mongoose.model("AdminProfile", AdminProfileSchema);
