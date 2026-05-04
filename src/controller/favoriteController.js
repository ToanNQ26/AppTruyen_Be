import * as favoriteService from '../services/favoriteService.js';
import { ApiResponse } from '../utils/apiResponse.js';

// Thêm vào mục yêu thích
export const addFavorite = async (req, res) => {
    const { story } = req.body;
    const userId = req.user.id; //lấy từ token

    const favorite = await favoriteService.createFavorite(userId, story);
    res.status(201).json(new ApiResponse({
      message:'Add favorite successfully!',
      result: favorite,
    }));
};

// Lấy danh sách yêu thích của user
export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await favoriteService.getFavoritesByUser(userId);
    res.json({ code: 0, message: 'Success', result: favorites });
  } catch (err) {
    res.status(500).json({ code: 9999, message: err.message });
  }
};

// Xóa khỏi mục yêu thích
export const removeFavorite = async (req, res) => {
  try {
    const  story  = req.params.storyId;
    const userId = req.user.id;

    console.log("HHHHHHHHHHHHHH=",story);
    const deleted = await favoriteService.deleteFavorite(userId, story);
    if (!deleted) {
      return res.status(404).json({ code: 1002, message: 'Favorite not found!' });
    }

    res.json({ code: 0, message: 'Removed from favorites successfully!' });
  } catch (err) {
    res.status(500).json({ code: 9999, message: err.message });
  }
};

// Admin: lấy tất cả favorite
export const getAllFavorites = async (req, res) => {
  try {
    const data = await favoriteService.getAllFavorites();
    res.json({ code: 0, message: 'Success', result: data });
  } catch (err) {
    res.status(500).json({ code: 9999, message: err.message });
  }
};
