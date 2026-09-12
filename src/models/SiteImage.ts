import mongoose from "mongoose";

const SiteImageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    section: {
      type: String,
      enum: [
        "HOME_HERO",
        "EQUIPMENT",
        "TRAINER",
        "BRANCH",
        "GALLERY",
        "TRANSFORMATION",
        "MEMBERSHIP",
      ],
      required: true,
    },
    secureUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    slot: {
      type: String,
      enum: [
        "HOME_HERO",
        "HOME_HERO_1",
        "HOME_HERO_2",
        "HOME_HERO_3",
        "STRENGTH",
        "CARDIO",
        "RECOVERY",
        "TRAINER_HEAD",
        "TRAINER_COACH_1",
        "TRAINER_COACH_2",
        "TRAINER_COACH_3",
        "BRANCH_EXTERIOR",
        "BRANCH_INTERIOR",
        "BRANCH_FLOOR",
        "BRANCH_RECOVERY",
        "GALLERY_1",
        "GALLERY_2",
        "GALLERY_3",
        "GALLERY_4",
        "GALLERY_5",
        "GALLERY_6",
        "TRANSFORMATION_BEFORE",
        "TRANSFORMATION_AFTER",
        "TRANSFORMATION_STORY",
        "MEMBERSHIP_ELITE",
        "MEMBERSHIP_PRO",
        "MEMBERSHIP_SELECT",
        "LOGIN_VISUAL",
        "DAILY_SCORE_VISUAL",
      ],
      default: undefined,
    },
    alt: { type: String, default: "" },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export default mongoose.models.SiteImage ||
  mongoose.model("SiteImage", SiteImageSchema);
