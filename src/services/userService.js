import User from "../model/User.js";
import bcrypt from "bcryptjs";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { AppError } from "../utils/exeption/AppError.js";
import { ErrorCode } from "../utils/exeption/ErrorCode.js";



export const updateRole = async (userId, role) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(ErrorCode.USER_NOT_EXISTED);
  }
  user.role = role;
  await user.save();
  return user;
};

export const createUser = async ({ name, email, password }) => {
  const hashedPassword = await hashPassword(password);
  const user = await User.create({ name, email, password: hashedPassword });
  return user;
};

export const getAllUsers = async () => {
  return await User.find().select("-password");
};

export const getUserById = async ( id) => {

  const user = await User.findById(id).select("-password");
  if (!user) throw new AppError(ErrorCode.USER_NOT_EXISTED);
  return user;
};



export const deleteUserById = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new AppError(ErrorCode.USER_NOT_EXISTED);
  return user;
};

export const updateUser = async (id,data) => {
  const updateData = { 
    name: data.name,
    email: data.email 
  };
  const updateUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password -role");

  if (!updateUser) throw new AppError(ErrorCode.USER_NOT_EXISTED);

  return updateUser;
};

export const updatePassword = async (id,{currentPassword,newPassword}) => {
  const user = await User.findById(id);

  if ( !currentPassword || !newPassword) {
    throw new AppError(ErrorCode.EMPTY_FIELD);
  }

  if (!user) {
    throw new AppError(ErrorCode.USER_NOT_EXISTED);
  }

  const isAuthenticated = await comparePassword(currentPassword, user.password);
  if (!isAuthenticated) {
    throw new AppError(ErrorCode.UNAUTHENTICATED);
  }

  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;

  await user.save();
};
