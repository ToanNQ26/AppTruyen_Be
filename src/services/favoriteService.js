import Favorite from "../model/Favorite.js";
import { AppError } from "../utils/exeption/AppError.js";
import { ErrorCode } from "../utils/exeption/ErrorCode.js";

export const createFavorite = async (userId, story) => {
  const exists = await isFavorite(userId, story);
    if (exists) {
      throw new AppError(ErrorCode.ALREADY_IN_FAVORITES);
    }
  return await Favorite.create({ user: userId,  story });
};

export const getFavoritesByUser = async (userId) => {
  return await Favorite.find({ user: userId })
    .populate('story', 'title coverImage status') // populate thông tin manga
    .sort({ createdAt: -1 });
};

export const deleteFavorite = async (userId, story) => {
  return await Favorite.findOneAndDelete({ user: userId, story });
};

export const isFavorite = async (userId, story) => {
  return await Favorite.exists({ user: userId, story });
};

export const getAllFavorites = async () => {
  return await Favorite.find().populate('user', 'name email').populate('manga', 'title');
};
