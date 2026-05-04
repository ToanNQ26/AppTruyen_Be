import * as genreService from '../services/genreService.js';

export const create = async (req, res, next) => {
  try {
    const genre = await genreService.createGenre(req.body);
    res.status(201).json({ message: 'Genre created', result: genre });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const genres = await genreService.getAllGenres();
    res.json({ result: genres });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const genre = await genreService.getGenreById(req.params.id);
    if (!genre) return res.status(404).json({ message: 'Genre not found' });
    res.json({ result: genre });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const genre = await genreService.updateGenre(req.params.id, req.body);
    if (!genre) return res.status(404).json({ message: 'Genre not found' });
    res.json({ message: 'Genre updated', result: genre });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const genre = await genreService.deleteGenre(req.params.id);
    if (!genre) return res.status(404).json({ message: 'Genre not found' });
    res.json({ message: 'Genre deleted', result: genre });
  } catch (error) {
    next(error);
  }
};
