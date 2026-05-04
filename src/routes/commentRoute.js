import express from 'express';
import { CommentController } from '../controller/commentController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', CommentController.getAll);
router.get('/:id', CommentController.getById);
router.post('/', verifyToken, CommentController.create);
router.put('/:id', verifyToken, CommentController.update);
router.delete('/:id', verifyToken, CommentController.delete);

export default router;
