import express from 'express';
import * as genreController from '../controller/genreController.js';

const router = express.Router();

router.post('/', genreController.create);
router.get('/', genreController.getAll);
router.get('/:id', genreController.getById);
router.put('/:id', genreController.update);
router.delete('/:id', genreController.remove);

export default router;
