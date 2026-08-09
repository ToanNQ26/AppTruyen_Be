import asyncHandler from "../utils/method/asyncHandler.js";
import * as adminService from "../services/adminService.js";
import { ApiResponse } from "../utils/apiResponse.js";


export const getDashboardStats = asyncHandler(async (req, res) => {
  const result = await adminService.getDashboardStats();

  return res.json(
    new ApiResponse({
      result,
    }),
  );
});
