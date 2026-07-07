import Follow from "../model/Follow.js";
import { isValidObjectId } from "../utils/validateObjectId.js";
import { AppError } from "../utils/exeption/AppError.js";
import { ErrorCode } from "../utils/exeption/ErrorCode.js";
import Story from "../model/Story.js";

/**
 * Create a new follow relationship
 * @param {Object} followData - Object containing userId and storyId
 * @returns {Promise<Object>} Created follow document
 */
export async function createFollow(followData) {
  const { userId, storyId } = followData;

  // Validate IDs
  if (!isValidObjectId(userId) || !isValidObjectId(storyId)) {
    throw new AppError(ErrorCode.INVALID_KEY);
  }

  // Check if follow already exists (optional, as unique index will prevent duplicates)
  const existingFollow = await Follow.findOne({ userId, storyId });
  if (existingFollow) {
    throw new AppError(ErrorCode.FOLLOW_ALREADY_EXISTS);
  }
  
  const follow = await Follow.create(followData);

  await Story.findByIdAndUpdate(
    storyId,
    { $inc: { followersCount: 1 } },
    { new: true }
  );

  return follow;
}

/**
 * Get a follow by its ID
 * @param {string} id - Follow ID
 * @returns {Promise<Object>} Follow document
 */
export async function getFollowById(id) {
  if (!isValidObjectId(id)) {
    throw new AppError(ErrorCode.INVALID_KEY);
  }

  const follow = await Follow.findById(id);
  if (!follow) {
    throw new AppError(ErrorCode.FOLLOW_NOT_FOUND);
  }
  return follow;
}

/**
 * Get follows by user ID with pagination
 * @param {string} userId - User ID
 * @param {number} page - Page number
 * @param {number} limit - Limit per page
 * @returns {Promise<Object>} Paginated follows
 */
export async function getFollowsByUser(
  userId,
  page = 1,
  limit = 10
) {
  if (!isValidObjectId(userId)) {
    throw new AppError(ErrorCode.INVALID_KEY);
  }

  const skip = (page - 1) * limit;

  const [follows, total] = await Promise.all([
    Follow.find({ userId })
      .populate({
        path: "storyId",
        select: "title slug coverUrl author status updatedAt"
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Follow.countDocuments({ userId })
  ]);

  return {
    stories: follows.map((f) => f.storyId),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
}

/**
 * Get follows by story ID with pagination
 * @param {string} storyId - Story ID
 * @param {number} page - Page number
 * @param {number} limit - Limit per page
 * @returns {Promise<Object>} Paginated follows
 */
export async function getFollowsByStory(storyId, page = 1, limit = 10) {
  if (!isValidObjectId(storyId)) {
    throw new AppError(ErrorCode.INVALID_KEY);
  }

  const skip = (page - 1) * limit;
  const [follows, total] = await Promise.all([
    Follow.find({ storyId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Follow.countDocuments({ storyId })
  ]);

  return {
    follows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Delete a follow by user ID and story ID
 * @param {string} userId - User ID
 * @param {string} storyId - Story ID
 * @returns {Promise<Object>} Deleted follow document
 */
export async function deleteFollow(userId, storyId) {
  if (!isValidObjectId(userId) || !isValidObjectId(storyId)) {
    throw new AppError(ErrorCode.INVALID_KEY);
  }

  const follow = await Follow.findOneAndDelete({ userId, storyId });
  if (!follow) {
    throw new AppError(ErrorCode.FOLLOW_NOT_FOUND);
  }

  await Story.findByIdAndUpdate(
    storyId,
    { $inc: { followersCount: -1 } },
  );

  return follow;
}

/**
 * Check if a follow exists between user and story
 * @param {string} userId - User ID
 * @param {string} storyId - Story ID
 * @returns {Promise<boolean>} True if follow exists
 */
export async function checkFollowExists(userId, storyId) {
  if (!isValidObjectId(userId) || !isValidObjectId(storyId)) {
    throw new AppError(ErrorCode.INVALID_KEY);
  }

  return await Follow.exists({ userId, storyId });
}