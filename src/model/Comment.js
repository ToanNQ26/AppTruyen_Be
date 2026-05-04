import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    storyId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true },
    chapterId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }, // tùy: null = bình luận truyện
    content:  { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Comment', commentSchema);
