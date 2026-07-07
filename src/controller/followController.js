import * as followService from '../services/followService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import asyncHandler from "../utils/method/asyncHandler.js";

// Follow a story
export const followStory = asyncHandler(async (req, res) => {
    const { storyId } = req.body;
    const userId = req.user.id; // lấy từ token

    const follow = await followService.createFollow({ userId, storyId });
    res.status(201).json(new ApiResponse({
        message: 'Follow story successfully!',
        result: follow,
    }));
});

// Get follow list of user
export const getUserFollows = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await followService.getFollowsByUser(userId, page, limit);
    res.json(new ApiResponse({
        result: result,
    }));
});

// Get followers of a story
export const getStoryFollowers = asyncHandler(async (req, res) => {
    const { storyId } = req.params;
    const page = Math.max(
    1,
    Number(req.query.page)||1
    );
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await followService.getFollowsByStory(storyId, page, limit);
    res.json(new ApiResponse({
        result: result,
    }));
});

// Unfollow a story
export const unfollowStory = asyncHandler(async (req, res) => {
    const { storyId } = req.params;
    const userId = req.user.id;

    await followService.deleteFollow(userId, storyId);
    res.json(new ApiResponse({
        message: 'Unfollow story successfully!',
    }));
});

// Check if user follows a story
export const checkFollow = asyncHandler(async (req, res) => {
    const { storyId } = req.params;
    const userId = req.user.id;

    const isFollowed = await followService.checkFollowExists(userId, storyId);
    res.json(new ApiResponse({
        result: { isFollowed },
    }));
});