import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema(
  {
    story:         { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true },
    chapterNumber: { type: Number, required: true },
    title:         { type: String },
    images:        [{ type: String, required: true }]
  },
  { timestamps: true }
);

// Không cho trùng số chương trong cùng một truyện
chapterSchema.index({ story: 1, chapterNumber: 1 }, { unique: true });

export default mongoose.model('Chapter', chapterSchema);
