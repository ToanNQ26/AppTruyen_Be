import Rating from "../model/Rating.js";
import { AppError } from "../utils/exeption/AppError.js";
import { ErrorCode } from "../utils/exeption/ErrorCode.js";

export const createRating = async (user, story, score) => {
  const rateExits = await checkRated(user, story);
  if (rateExits) throw new AppError(ErrorCode.ALREADY_RATED_THIS_STORY);
  return Rating.create({ user, story, score });
};

export const updateRating = async (user, story, score) => {
  const rated = await Rating.findOne({ user, story });
  if (!rated) throw new AppError(ErrorCode.USER_HAS_NOT_PREVIOUSLY_RATED_THIS);
  rated.score = score;
  return rated.save();
};

export const deleteRating = async (user, story) => {
  return Rating.findOneAndDelete({ user, story });
};

const checkRated = async (user, story) => {
  return Rating.exists({ user, story }); // thiếu báo lỗi khi không tìm thấy giá trị cần xóa
};
