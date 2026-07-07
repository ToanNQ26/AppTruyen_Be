import Story from "../model/Story.js";
import Genre from "../model/Genre.js";
import { isValidObjectId } from "../utils/validateObjectId.js";
import path from 'path';
import { safeDeleteFile } from "../utils/file.js";
import { AppError } from "../utils/exeption/AppError.js";
import { ErrorCode } from "../utils/exeption/ErrorCode.js";
import { uploadImageRAM } from "../utils/could/cloudinaryUpload.js";
import { increaseView } from "./viewDailyService.js";

export async function listStories(queryParams) {
  const page = Math.max(1, Number(queryParams.page) || 1);
  const limit = Math.max(1, Number(queryParams.limit) || 12);

  const sortMap = {
    newest: "-createdAt",
    oldest: "createdAt",
    views: "-views",
    followers: "-followersCount",
    updated: "-updatedAt",
  };

  const sort = sortMap[queryParams.sort] || "-updatedAt";
  const query = {};

  if (queryParams.storyType) {
    query.storyType = queryParams.storyType;
  }

  if (queryParams.status) {
    query.status = queryParams.status;
  }

  if (queryParams.isColor !== undefined) {
    query.isColor = queryParams.isColor === "true";
  }

  if (queryParams.genres) {
    const genreIds = queryParams.genres
      .split(",")
      .filter(Boolean);

    query.genres = {
      $in: genreIds
    };
  }

  if (queryParams.search) {
    const keyword = queryParams.search.trim();

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } }
      ];

      if (keyword.length >= 6) {
        query.$text = { $search: keyword };
      }
    }
  }

  const total = await Story.countDocuments(query);

  const stories = await Story.find(query)
    .populate("genres", "name")
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    stories,
  };
}

export async function getStoryBySlug(slug) {
  const story = await Story.findOne({ slug }).populate('genres', 'name');
  if(!story) {
    const error = new Error('Not found story');
    error.statusCode = 400;
    throw error;
  }
  return story;
}

export async function createStory(data) {
  return Story.create(data);
}

export async function updateStory(id, data) {
  const story = await Story.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if(!story) throw new AppError(ErrorCode.STORY_NOT_EXISTED);
  
  return story;
}

export async function deleteStory(id) {
  if (!isValidObjectId(id)) {
    throw new AppError(ErrorCode.INVALID_KEY);
  }

  const deleted = await Story.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(ErrorCode.STORY_NOT_EXISTED);
  }

  return deleted;
}

export const uploadCover = async (storyId, file) => {
  try {
    if (!file) {
      throw new AppError(ErrorCode.EMPTY_FIELD);
    }

    if (!isValidObjectId(storyId)) {
      throw new AppError(ErrorCode.INVALID_KEY);
    }

    const story = await Story.findById(storyId);
    console.log(story.title);
    if (!story) {
      throw new AppError(ErrorCode.STORY_NOT_EXISTED);
    }

    // Upload lên Cloudinary
    const imageUrl = await uploadImageRAM(file.buffer, story.title);


    // Lưu đường dẫn mới vào story
    story.coverUrl = imageUrl;
    await story.save();

    return story;
  } catch (err) {
   throw err;
  }
};