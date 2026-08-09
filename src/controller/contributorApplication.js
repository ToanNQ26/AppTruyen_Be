import asyncHandler from "../utils/method/asyncHandler.js";
import * as contributorService from "../services/contributorApplication.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createApplication = asyncHandler(async (req, res) => {
  const application = await contributorService.createApplication(
    req.user.id,
    req.body.introduction
  );

  return res.json(
    new ApiResponse({
      message: "Gửi đơn đăng ký cộng tác viên thành công.",
      result: application,
    })
  );
});

export const getMyApplication = asyncHandler(async (req, res) => {
  const application =
    await contributorService.getMyApplication(req.user.id);

  return res.json(
    new ApiResponse({
      result: application,
    })
  );
});

export const getApplications = asyncHandler(async (req, res) => {
  const applications =
    await contributorService.getApplications(req.query);

  return res.json(
    new ApiResponse({
      result: applications,
    })
  );
});

export const getApplicationById = asyncHandler(async (req, res) => {
  const application =
    await contributorService.getApplicationById(req.params.id);

  return res.json(
    new ApiResponse({
      result: application,
    })
  );
});

export const approveApplication = asyncHandler(async (req, res) => {
  const application =
    await contributorService.approveApplication(
      req.params.id,
      req.user.id
    );

  return res.json(
    new ApiResponse({
      message: "Duyệt đơn đăng ký cộng tác viên thành công.",
      result: application,
    })
  );
});

export const rejectApplication = asyncHandler(async (req, res) => {
  const application =
    await contributorService.rejectApplication(
      req.params.id,
      req.user.id,
      req.body.reason
    );

  return res.json(
    new ApiResponse({
      message: "Đã từ chối đơn đăng ký cộng tác viên.",
      result: application,
    })
  );
});