import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true }
  },
  { timestamps: true }
);

// Mỗi user chỉ có thể thêm 1 lần vào mục yêu thích
favoriteSchema.index({ user: 1, story: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);
