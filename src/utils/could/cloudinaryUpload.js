// src/utils/cloudinaryUpload.js
import cloudinary from "../../config/cloudinary.js";
import { Readable } from "stream";


export const uploadImage = async (filePath,storyName) => {
  const folderPath = `truyen-tranh/${sanitizeFolderName(storyName)}/cover`;
  const publicId = `/cover`;

  const res = await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    folder: folderPath,
    overwrite: true
  });
  return res.secure_url;
};

export const uploadImageRAM = (buffer, storyName) => {
  const folderPath = `truyen-tranh/${sanitizeFolderName(storyName)}/cover`;
  const publicId = "cover";

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folderPath,
        public_id: publicId,
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
};

// export const deleteImage = async (storyId) => {
//   try {
//     const res = await cloudinary.uploader.destroy(`truyen-tranh/${storyId}`);
//     return res;
//   } catch (err) {
//     console.error("Lỗi khi xóa ảnh trên Cloudinary:", err);
//     throw err;
//   }
// };

export const uploadChapterImageSSD = async (filePath, storyName, chapterNumber) => {
  const folderPath = `truyen-tranh/${sanitizeFolderName(storyName)}/chapter-${chapterNumber}`;
  
  const res = await cloudinary.uploader.upload(filePath, {
    folder: folderPath,
  });

  return res.secure_url;
};

export const uploadChapterImageRAM = (buffer, storyName, chapterNumber) => {
  const folderPath = `truyen-tranh/${sanitizeFolderName(
    storyName
  )}/chapter-${chapterNumber}`;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folderPath,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
};

function sanitizeFolderName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // khoảng trắng → dấu gạch ngang
    .replace(/[^a-z0-9\-]/g, ''); // xóa ký tự không hợp lệ
}

export const deleteFolderFromCloudinary = async (storyTitle, chapterNumber) => {
  const sanitizedTitle = sanitizeFolderName(storyTitle);
  const folderPath = `truyen-tranh/${sanitizedTitle}/chapter-${chapterNumber}`;

  try {
    const { resources } = await cloudinary.api.resources({
      type: 'upload',
      prefix: folderPath,
      max_results: 500,
    });

    for (const resource of resources) {
      await cloudinary.uploader.destroy(resource.public_id);
    }

    return true;
  } catch (error) {
    throw new Error('Failed to delete folder from Cloudinary: ' + error.message);
  }
};
