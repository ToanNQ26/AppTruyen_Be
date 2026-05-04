import Chapter from "../model/Chapter.js";
import { AppError } from "../utils/exeption/AppError.js";
import { ErrorCode } from "../utils/exeption/ErrorCode.js";
import Story from "../model/Story.js";
import { uploadChapterImage, deleteFolderFromCloudinary } from "../utils/could/cloudinaryUpload.js";
import fs from "fs/promises";
import mongoose from "mongoose";
import { isValidObjectId } from "../utils/validateObjectId.js";

export async function addChapter(data, files) {
  try {
    const { story, chapterNumber, title } = data;
    const storyCheck = await Story.findById(data.story);
    if (!storyCheck) throw new AppError(ErrorCode.STORY_NOT_EXISTED);

    const uploadPromises = files.map(async (file) => {
      const url = await uploadChapterImage(
        file.path,
        storyCheck.title,
        data.chapterNumber
      );
      await fs.unlink(file.path);
      return url;
    });
    const imageUrls = await Promise.all(uploadPromises);
    // 3. Tạo chương
    const chapter = await Chapter.create({
      story: story,
      chapterNumber: Number(chapterNumber),
      title: data.title,
      images: imageUrls,
    });

    return chapter;
  } catch (err) {
    await Promise.all(
      files.map((file) => fs.unlink(file.path).catch(() => {}))
    );
    throw err;
  }
}

export async function getChaptersByStoryId(storyId) {
  try {
    if(!isValidObjectId(storyId)) throw new AppError(ErrorCode.STORY_NOT_EXISTED);
    const chapters = await Chapter.find({ story: storyId }).sort({ number: 1 });

    if (!chapters || chapters.length === 0) {
      throw new AppError(
        ErrorCode.CHAPTER_NOT_FOUND,
        "Không tìm thấy chương nào cho truyện này"
      );
    }

    return chapters;
  } catch (error) {
    throw error;
  }
}



export const deleteChapter = async (storyId, chapterNumber) => {
  if (!isValidObjectId(storyId)) {
    throw new AppError(ErrorCode.INVALID_KEY, 'Invalid storyId');
  }

  const story = await Story.findById(storyId);
  if (!story) {
    throw new AppError(ErrorCode.STORY_NOT_EXISTED, 'Story not found');
  }

  const chapter = await Chapter.findOneAndDelete({
    story: storyId,
    chapterNumber,
  });

  if (!chapter) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Chapter not found');
  }

  await deleteFolderFromCloudinary(story.title, chapterNumber);

  return chapter;
};

