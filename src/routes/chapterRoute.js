import express from 'express';
import { addChapter, deleteChapter, getListChapter, getChapter } from '../controller/chapterController.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.post('/', upload.array('images'), addChapter);
router.get('/story/:id', getListChapter);
router.get('/:slug/:chapterNumber', getChapter);
router.delete('/:storyId/:chapterNumber', deleteChapter);

export default router;