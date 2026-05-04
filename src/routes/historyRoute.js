import express from 'express';
import * as HistoryController from '../controller/historyController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes below require authentication
router.use(verifyToken);

router.get('/', HistoryController.getHistories);
router.get('/:id', HistoryController.getHistory);
router.post('/', HistoryController.createOrUpdateHistory);
router.delete('/:id', HistoryController.deleteHistory);
router.delete('/', HistoryController.deleteAllHistories);

export default router;
