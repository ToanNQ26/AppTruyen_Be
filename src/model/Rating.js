import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true },
    score: { type: Number, min: 1, max: 5, required: true }
  },
  { timestamps: true }
);

// Mỗi user chỉ đánh giá 1 lần / truyện
ratingSchema.index({ user: 1, story: 1 }, { unique: true });

export default mongoose.model('Rating', ratingSchema);
