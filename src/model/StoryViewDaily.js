import mongoose from "mongoose";

const storyViewDailySchema = new mongoose.Schema(
  {
    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Mỗi truyện chỉ có 1 record cho mỗi ngày
storyViewDailySchema.index(
  { storyId: 1, date: 1 },
  { unique: true }
);

export default mongoose.model(
  "StoryViewDaily",
  storyViewDailySchema
);