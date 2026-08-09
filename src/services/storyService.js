import Story from "../model/Story.js";
import Genre from "../model/Genre.js";
import { isValidObjectId } from "../utils/validateObjectId.js";
import path from "path";
import { safeDeleteFile } from "../utils/file.js";
import { AppError } from "../utils/exeption/AppError.js";
import { ErrorCode } from "../utils/exeption/ErrorCode.js";
import {
  deleteStoryCover,
  uploadImageRAM,
} from "../utils/could/cloudinaryUpload.js";
import { increaseView } from "./viewDailyService.js";

// hàm tiện ích
const createSlug = (text) => {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

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
    const genreIds = queryParams.genres.split(",").filter(Boolean);

    query.genres = {
      $in: genreIds,
    };
  }

  if (queryParams.search) {
    const keyword = queryParams.search.trim();

    if (keyword) {
      query.$or = [{ title: { $regex: keyword, $options: "i" } }];

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
  const story = await Story.findOne({ slug }).populate("genres", "name");
  if (!story) {
    const error = new Error("Not found story");
    error.statusCode = 400;
    throw error;
  }
  return story;
}

export const createStory = async ({ userId, storyData, coverFile }) => {
  const {
    title,
    author,
    description,
    storyType,
    storyLanguage,
    isColor,
    direction,
    status,
    genres,
    tags,
  } = storyData;

  // =========================
  // 1. Validate dữ liệu
  // =========================

  if (!title?.trim()) {
    throw new AppError("Tên truyện không được để trống", 400);
  }

  if (!storyType) {
    throw new AppError("Vui lòng chọn loại truyện", 400);
  }

  if (!coverFile) {
    throw new AppError("Vui lòng chọn ảnh bìa", 400);
  }

  // =========================
  // 2. Kiểm tra storyType
  // =========================

  const allowedStoryTypes = ["Manga", "Manhua", "Manhwa", "Webtoon", "Comic"];

  if (!allowedStoryTypes.includes(storyType)) {
    throw new AppError("Loại truyện không hợp lệ", 400);
  }

  // =========================
  // 3. Kiểm tra title trùng
  // =========================

  const existingStory = await Story.findOne({
    title: title.trim(),
  });

  if (existingStory) {
    throw new AppError("Tên truyện đã tồn tại", 409);
  }

  // =========================
  // 4. Tạo slug
  // =========================

  const slug = createSlug(title);

  const existingSlug = await Story.findOne({ slug });

  if (existingSlug) {
    throw new AppError("Slug của truyện đã tồn tại", 409);
  }

  // =========================
  // 5. Upload ảnh bìa
  // =========================

  const coverUrl = await uploadImageRAM(coverFile.buffer, title);

  // =========================
  // 6. Parse genres / tags
  // =========================

  let parsedGenres = genres;

  if (typeof genres === "string") {
    try {
      parsedGenres = JSON.parse(genres);
    } catch {
      throw new AppError("Danh sách thể loại không hợp lệ", 400);
    }
  }

  let parsedTags = tags;

  if (typeof tags === "string") {
    try {
      parsedTags = JSON.parse(tags);
    } catch {
      parsedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }
  }

  // =========================
  // 7. Tạo Story
  // =========================

  const story = await Story.create({
    title: title.trim(),
    slug,

    author: author?.trim() || "",
    description: description?.trim() || "",

    coverUrl,

    storyType,
    storyLanguage: storyLanguage || "Vietnamese",

    isColor: isColor === true || isColor === "true",

    direction: direction || "right-to-left",

    status: status || "ongoing",

    genres: parsedGenres || [],
    tags: parsedTags || [],
    createdBy: userId,
  });

  return story;
};

export async function updateStory(id, data) {
  const story = await Story.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!story) throw new AppError(ErrorCode.STORY_NOT_EXISTED);

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

  await deleteStoryCover(deleted.title);

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

export async function getMyStories(userId, queryParams = {}) {
  if (!isValidObjectId(userId)) {
    throw new AppError(ErrorCode.INVALID_KEY);
  }
  console.log(userId);
  const page = Math.max(1, Number(queryParams.page) || 1);
  const limit = Math.max(1, Number(queryParams.limit) || 12);

  const skip = (page - 1) * limit;

  const query = {
    createdBy: userId,
  };

  const total = await Story.countDocuments(query);

  const stories = await Story.find(query)
    .populate("genres", "name")
    .sort({ updatedAt: -1 })
    .skip(skip)
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
