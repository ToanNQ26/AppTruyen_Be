import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

// chống follow trùng (QUAN TRỌNG)
followSchema.index({ userId: 1, storyId: 1 }, { unique: true });

// tối ưu query story followers
followSchema.index({ storyId: 1, createdAt: -1 });

// tối ưu query user follow list
followSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Follow", followSchema);