import asyncHandler from "../utils/method/asyncHandler.js";
import * as chapterService from "../services/chapterService.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const addChapter = asyncHandler(async (req, res) => {
  try {
    const chapter = await chapterService.addChapter(req.body,req.files);
    
    return res.json(
      new ApiResponse({
        result: chapter,
      })
    );
  } catch (err) {
    throw err;
  }
});

export const getChaptersByStoryId = asyncHandler(async (req, res) => {
  const chapter = await chapterService.getChaptersByStoryId(req.params.id);
  return res.json(
    new ApiResponse({
      result: chapter,
    })
  );
});

export const deleteChapter = async (req, res, next) => {
    const { storyId, chapterNumber } = req.params;

    const deletedChapter = await chapterService.deleteChapter(storyId, chapterNumber);

    res.json(
      new ApiResponse({
      code: 1000,
      message: 'Chapter deleted successfully',
      result: deletedChapter,
    })
  );
};