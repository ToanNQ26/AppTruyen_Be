import User from "../model/user.js";
import bcrypt from "bcryptjs";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { AppError } from "../utils/exeption/AppError.js";
import { ErrorCode } from "../utils/exeption/ErrorCode.js";

export const createUser = async ({ name, email, password }) => {
  const hashedPassword = await hashPassword(password);
  const user = await User.create({ name, email, password: hashedPassword });
  return user;
};

export const getAllUsers = async () => {
  return await User.find().select("-password");
};

export const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw new AppError(ErrorCode.USER_NOT_EXISTED);
  return user;
};

export const deleteUserById = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new AppError(ErrorCode.USER_NOT_EXISTED);
  return user;
};

export const updateUser = async ({ id, name, email }) => {
  const updateData = { name, email };

  const updateUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updateUser) throw new AppError(ErrorCode.USER_NOT_EXISTED);

  return updateUser;
};

export const updatePassword = async ({ email, oldPassword, password }) => {
  const user = await User.findOne({ email });

  if (!email || !password || !oldPassword) {
    return res.status(400).json({ message: "Email và password là bắt buộc." });
  }

  if (!user) {
    throw new AppError(ErrorCode.USER_NOT_EXISTED);
  }

  const isAuthenticated = await comparePassword(oldPassword, user.password);
  if (!isAuthenticated) {
    throw new AppError(ErrorCode.UNAUTHENTICATED);
  }

  const hashedPassword = await hashPassword(password);
  user.password = hashedPassword;

  await user.save();
};
