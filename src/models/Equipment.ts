import mongoose from "mongoose";

const EquipmentSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GymBranch",
    },
    name: { type: String, required: true },
    number: {
      type: String,
      trim: true,
    },
    category: String,
    working: {
      type: Boolean,
      default: true,
    },
    maintenance: {
      type: Boolean,
      default: false,
    },
    lastMaintenance: Date,
    nextMaintenance: Date,
    imageUrl: String,
    imagePublicId: String,
    notes: String,
  },
  { timestamps: true },
);

export default mongoose.models.Equipment ||
  mongoose.model("Equipment", EquipmentSchema);
