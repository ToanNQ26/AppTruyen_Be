import Chapter from "../model/Chapter.js";
import { AppError } from "../utils/exeption/AppError.js";
import { ErrorCode } from "../utils/exeption/ErrorCode.js";
import Story from "../model/Story.js";
import { uploadChapterImageRAM, deleteFolderFromCloudinary } from "../utils/could/cloudinaryUpload.js";
import fs from "fs/promises";
import mongoose from "mongoose";
import { isValidObjectId } from "../utils/validateObjectId.js";


// upload trong ổ cứng
// export async function addChapter(data, files) {
//   try {
//     const { story, chapterNumber, title } = data;
//     const storyCheck = await Story.findById(data.story);
//     if (!storyCheck) throw new AppError(ErrorCode.STORY_NOT_EXISTED);

//     const uploadPromises = files.map(async (file) => {
//       const url = await uploadChapterImageSSD(
//         file.path,
//         storyCheck.title,
//         data.chapterNumber
//       );
//       await fs.unlink(file.path);
//       return url;
//     });
//     const imageUrls = await Promise.all(uploadPromises);
//     // 3. Tạo chương
//     const chapter = await Chapter.create({
//       story: story,
//       chapterNumber: Number(chapterNumber),
//       title: data.title,
//       images: imageUrls,
//     });

//     return chapter;
//   } catch (err) {
//     await Promise.all(
//       files.map((file) => fs.unlink(file.path).catch(() => {}))
//     );
//     throw err;
//   }
// }

// upload trong ram
export async function addChapter(data, files) {
    const { story, chapterNumber, title } = data;
    const storyCheck = await Story.findById(data.story);
    if (!storyCheck) throw new AppError(ErrorCode.STORY_NOT_EXISTED);

    const uploadPromises = files.map(async (file) => {
        const url = await uploadChapterImageRAM(
          file.buffer,
          storyCheck.title,
          chapterNumber
      );
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
}



export async function getListChapter(storyId) {
  try {

    if (!isValidObjectId(storyId)) {
      throw new AppError(ErrorCode.STORY_NOT_EXISTED);
    }

    const story = await Story.findById(storyId);

    if (!story) {
      throw new AppError(ErrorCode.STORY_NOT_EXISTED);
    }

    const chapters = await Chapter.find(
      { story: storyId },

      // projection
      {
        images: 0,
        __v: 0,
        updatedAt: 0,
      }
    )
      .sort({ chapterNumber: -1 })
      .lean();

    return chapters;

  } catch (error) {
    throw error;
  }
}

export async function getChapter(slug, chapterNumber) {

  const parsedChapter = Number(chapterNumber);

  if (isNaN(parsedChapter)) {
    throw new AppError(
      ErrorCode.CHAPTER_NOT_FOUND,
      'Số chapter không hợp lệ'
    );
  }

  const story = await Story.findOne({ slug })
    .select('_id')
    .lean();

  if (!story) {
    throw new AppError(
      ErrorCode.STORY_NOT_EXISTED,
      'Truyện không tồn tại'
    );
  }

  const chapter = await Chapter.findOne({
    story: story._id,
    chapterNumber: parsedChapter
  }).lean();

  if (!chapter) {
    throw new AppError(
      ErrorCode.CHAPTER_NOT_FOUND,
      'Chapter không tồn tại'
    );
  }

  return chapter;
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

