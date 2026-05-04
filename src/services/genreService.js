import Genre from "../model/Genre.js";

export const createGenre = async (data) => {
  const genre = new Genre(data);
  return await genre.save();
};

export const getAllGenres = async () => {
  return await Genre.find().sort({ name: 1 });
};

export const getGenreById = async (id) => {
  return await Genre.findById(id);
};

export const updateGenre = async (id, data) => {
  return await Genre.findByIdAndUpdate(id, data, { new: true });
};

export const deleteGenre = async (id) => {
  return await Genre.findByIdAndDelete(id);
};
