import Comment from '../model/Comment.js';
import { AppError } from '../utils/exeption/AppError.js';
import { ErrorCode } from '../utils/exeption/ErrorCode.js';
import Story from '../model/Story.js';
import Chapter from '../model//Chapter.js';

export const CommentService = {
  async create(data) {
    console.log(data);
    console.log(data.storyId);
    const storyExists = await Story.exists({_id: data.storyId});
    if(!storyExists) {
      throw new AppError(ErrorCode.STORY_NOT_EXISTED);
    }
    const chaptercheck = await Chapter.exists({
      _id: data.chapterId,
      story: data.storyId,
    });
    if(!chaptercheck) {
      throw new AppError(ErrorCode.CHAPTER_NOT_EXISTED);
    }

    const comment = new Comment(data);
    return await comment.save();
  },

  async getAll({ storyId, chapterId }) {
    const query = {};
    if (storyId) query.storyId = storyId;
    if (chapterId) query.chapterId = chapterId;

    return await Comment.find(query)
      .populate('userId', 'name email')
      .populate('storyId', 'title')
      .populate('chapterId', 'title')
      .sort({ createdAt: -1 });
  },

  async getById(id) {
    return await Comment.findById(id)
      .populate('userId', 'name email')
      .populate('storyId', 'title')
      .populate('chapterId', 'title');
  },

  async update(id, userId, content) {
    const comment = await Comment.findById(id);
    if (!comment) throw new Error('Không tìm thấy bình luận');
    if (comment.userId.toString() !== userId) throw new Error('Không có quyền sửa');

    comment.content = content;
    return await comment.save();
  },

  async delete(id, userId) {
    const comment = await Comment.findById(id);
    if (!comment) throw new Error('Không tìm thấy bình luận');
    if (comment.userId.toString() !== userId) throw new Error('Không có quyền xóa');

    await comment.deleteOne();
    return { message: 'Đã xóa bình luận' };
  }
};
