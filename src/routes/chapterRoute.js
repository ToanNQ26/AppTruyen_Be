import express from 'express';
import { addChapter, deleteChapter, getChaptersByStoryId } from '../controller/chapterController.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.post('/', upload.array('images'), addChapter);
router.get('/:id', getChaptersByStoryId);
router.delete('/:storyId/:chapterNumber', deleteChapter);

export default router;