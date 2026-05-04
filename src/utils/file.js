// utils/file.js
import fs from 'fs/promises';
import path from 'path';

export async function safeDeleteFile(filename) {
  const filePath = path.join('uploads', filename);
  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.warn(`❗ Không thể xóa file ${filePath}:`, err.message);
  }
}
