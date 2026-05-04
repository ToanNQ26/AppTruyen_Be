import express from 'express';
import * as favoriteController from '../controller/favoriteController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.use(verifyToken);
// Người dùng
router.post('/', favoriteController.addFavorite); // Thêm vào favorites
router.get('/', favoriteController.getUserFavorites); // Lấy danh sách
router.delete('/:storyId', favoriteController.removeFavorite); // Xóa

// Admin
router.get('/all', favoriteController.getAllFavorites);

export default router;
