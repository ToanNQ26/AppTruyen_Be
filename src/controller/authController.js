import asyncHandler from "../utils/method/asyncHandler.js";
import * as authService from '../services/authService.js';
import { ApiResponse } from "../utils/apiResponse.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const token = await authService.login(email, password);
  res.json(new ApiResponse({
    result: { token },
  }));
});
