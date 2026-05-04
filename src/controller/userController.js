import asyncHandler from "../utils/method/asyncHandler.js";
import * as userService from "../services/userService.js";
import { ApiResponse } from "../utils/apiResponse.js";

// GET /api/users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  return res.json(
    new ApiResponse({
      result: users,
    })
  );
});

// POST /api/users
export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  return res.json(
    new ApiResponse({
      result: user,
    })
  );
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  return res.json(
    new ApiResponse({
      result: user,
    })
  );
});

export const deleteUserById = asyncHandler(async (req, res) => {
  const user = await userService.deleteUserById(req.params.id);

  return res.json(
    new ApiResponse({
      result: user,
    })
  );
});

export const updateUser = asyncHandler(async (req, res) => {
  const updateUser = await userService.updateUser(req.body);

  return res.json(
    new ApiResponse({
      result: updateUser,
    })
  );
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { email, oldPassword, password } = req.body;

  await userService.updatePassword({ email, oldPassword, password });

  return res.json(new ApiResponse({}));
});
