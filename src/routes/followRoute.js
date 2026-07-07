import express from 'express';
import * as followController from '../controller/followController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
// Người dùng
router.post('/', followController.followStory); // Follow một story
router.get('/', followController.getUserFollows); // Lấy danh sách follow của user
router.get('/story/:storyId', followController.getStoryFollowers); // Lấy danh sách follower của story
router.delete('/:storyId', followController.unfollowStory); // Unfollow một story
router.get('/check/:storyId', followController.checkFollow); // Kiểm tra follow

export default router;