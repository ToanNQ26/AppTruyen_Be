import mongoose from 'mongoose';

const storySchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    author:      { type: String },
    description: { type: String },
    coverUrl:    { type: String },

    storyType: {
      type: String,
      enum: ['Manga', 'Manhua', 'Manhwa', 'Webtoon', 'Comic'],
      required: true
    },
    storyLanguage:  { type: String, default: 'Vietnamese' },
    isColor:   { type: Boolean, default: false },
    direction: { type: String, enum: ['left-to-right', 'right-to-left', 'vertical'], default: 'right-to-left' },

    status:  { type: String, enum: ['ongoing', 'completed', 'hiatus'], default: 'ongoing' },
    genres:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre', default: [] }],
    tags:    [{ type: String, lowercase: true , trim: true, default: []}],
    views:   { type: Number, default: 0, min: 0 },
    commentCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

storySchema.index({ views: -1 });
storySchema.index({ genres: 1, status: 1, views: -1 });
storySchema.index({ title: 'text' });
storySchema.index({ storyType: 1, status: 1 });
storySchema.index({ genres: 1 });

export default mongoose.model('Story', storySchema);
