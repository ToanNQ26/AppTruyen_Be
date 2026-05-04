import Story from "../model/Story.js";
import Genre from "../model/Genre.js";
import { isValidObjectId } from "../utils/validateObjectId.js";
import fs from 'fs/promises';
import path from 'path';
import { safeDeleteFile } from "../utils/file.js";
import { AppError } from "../utils/exeption/AppError.js";
import { ErrorCode } from "../utils/exeption/ErrorCode.js";
import { uploadImage } from "../utils/could/cloudinaryUpload.js";

export async function listStories(queryParams) {
  const page = Number(queryParams.page) || 1;
  const limit = Number(queryParams.limit) || 20;
  const sort = queryParams.sort || '-updatedAt';

  const query = {};

  if (queryParams.storyType) query.storyType = queryParams.storyType;
  if (queryParams.status) query.status = queryParams.status;
  if (queryParams.isColor !== undefined) {
    query.isColor = queryParams.isColor === 'true';
  }
  if (queryParams.genres) {
    query.genres = { $in: queryParams.genres.split(',') };
  }
  if (queryParams.search) {
    query.$text = { $search: queryParams.search };
  }

  const total = await Story.countDocuments(query);

  const stories = await Story.find(query)
    .populate('genres', 'name')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

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

export async function incrementViews(id) {
  return Story.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
}

export const uploadCover = async (storyId, file) => {
  try {
    if (!file) {
      throw new AppError(ErrorCode.EMPTY_FIELD);
    }

    if (!isValidObjectId(storyId)) {
      await fs.unlink(file.path); // xóa file tạm nếu storyId sai
      throw new AppError(ErrorCode.INVALID_KEY);
    }

    const story = await Story.findById(storyId);
    console.log(story.title);
    if (!story) {
      await fs.unlink(file.path); // xóa file tạm nếu không tìm thấy story
      throw new AppError(ErrorCode.STORY_NOT_EXISTED);
    }

    // Upload lên Cloudinary
    const imageUrl = await uploadImage(file.path, story.title);

    // Xóa file ảnh tạm sau khi đã upload lên cloudinary
    await fs.unlink(file.path);

    // Lưu đường dẫn mới vào story
    story.coverUrl = imageUrl;
    await story.save();

    return story;
  } catch (err) {
    // Nếu có lỗi, xóa file tạm nếu tồn tại
    if (file?.path) {
      try {
        await fs.unlink(file.path);
      } catch (_) {}
    }

   throw err;
  }
};