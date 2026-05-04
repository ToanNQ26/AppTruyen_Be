import express from 'express';
import * as rateController from '../controller/rateController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.use(verifyToken);

router.post('/', rateController.Rating);
router.put('/',rateController.updateRated);
router.delete('/:storyId',rateController.deleteRated);

export default router;