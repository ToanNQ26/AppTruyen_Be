import mongoose from "mongoose";

const contributorApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    introduction: {
      type: String,
      trim: true,
      maxlength: 3000,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    rejectionReason: {
      type: String,
      default: null,
      trim: true,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Tăng tốc truy vấn các đơn theo trạng thái
contributorApplicationSchema.index({
  status: 1,
  createdAt: -1,
});

export default  mongoose.model(
  "ContributorApplication",
  contributorApplicationSchema,
);
