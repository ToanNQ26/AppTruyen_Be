import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    story:    { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true },
    chapter:  { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
    lastReadAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Truy vấn nhanh lịch sử đọc
historySchema.index({ user: 1, story: 1 }, { unique: true });

export default mongoose.model('History', historySchema);
