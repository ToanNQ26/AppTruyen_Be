import { CommentService } from '../services/commentService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const CommentController = {
  async create(req, res) {
    try {
      const { storyId, chapterId, content } = req.body;
      const userId = req.user.id; // từ token
      const comment = await CommentService.create({ userId, storyId, chapterId, content });
      return res.json(
            new ApiResponse({
              result: chapter,
            })
          );
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const { storyId, chapterId } = req.query;
      const comments = await CommentService.getAll({ storyId, chapterId });
      res.json(comments);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const comment = await CommentService.getById(req.params.id);
      if (!comment) return res.status(404).json({ message: 'Không tìm thấy bình luận' });
      res.json(comment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { content } = req.body;
      const comment = await CommentService.update(req.params.id, req.user.id, content);
      res.json(comment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async delete(req, res) {
    try {
      const result = await CommentService.delete(req.params.id, req.user.id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};
