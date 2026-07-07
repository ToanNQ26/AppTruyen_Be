import asyncHandler from "../utils/method/asyncHandler.js";
import * as storiesService from "../services/storyService.js";
import { ApiResponse } from "../utils/apiResponse.js";

// nhận về 1 list
export const getListStory = asyncHandler(async (req, res) => {
  const result = await storiesService.listStories(req.query);
  return res.json(
    new ApiResponse({
      result: result,
    })
  );
});

// nhận về 1 truyện
export const getStoryBySlug = asyncHandler(async (req, res) => {
  const result = await storiesService.getStoryBySlug(req.params.slug);
  return res.json(
    new ApiResponse({
      result: result,
    })
  );
});

//tạo truyện
export const createStory = asyncHandler(async (req, res) => {
  const story = await storiesService.createStory(req.body);
  return res.json(
    new ApiResponse({
      result: story,
    })
  );
});

//update truyện
export const updateStory = asyncHandler(async (req, res) => {
  const story = await storiesService.updateStory(req.params.id, req.body);
  return res.json(
    new ApiResponse({
      result: story,
    })
  );
});

export const deleteStory = asyncHandler(async (req, res) => {
  const story = await storiesService.deleteStory(req.params.id);
  return res.json(
    new ApiResponse({
      result: story,
    })
  );
});

//update ảnh
export const uploadStoryCover = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const file = req.file;

  const updatedStory = await storiesService.uploadCover(id, file);
  return res.json(new ApiResponse({
    message: 'Cập nhật ảnh bìa thành công',
    data: updatedStory, // Gợi ý trả về thông tin story đã cập nhật
  }));
});

