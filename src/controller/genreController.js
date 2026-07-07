import * as genreService from '../services/genreService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const create = async (req, res, next) => {
  try {
    const genre = await genreService.createGenre(req.body);
    res.json(
      new ApiResponse({ message: 'Genre created', result: genre })
    )
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const genres = await genreService.getAllGenres();
    res.json(new ApiResponse({ result: genres }));
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const genre = await genreService.getGenreById(req.params.id);
    if (!genre) return res.status(404).json({ message: 'Genre not found' });
    res.json(new ApiResponse({ result: genre }));
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const genre = await genreService.updateGenre(req.params.id, req.body);
    if (!genre) return res.status(404).json({ message: 'Genre not found' });
    res.json(new ApiResponse({ message: 'Genre updated', result: genre }));
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const genre = await genreService.deleteGenre(req.params.id);
    if (!genre) return res.status(404).json({ message: 'Genre not found' });
    res.json(new ApiResponse({ message: 'Genre deleted', result: genre }));
  } catch (error) {
    next(error);
  }
};
