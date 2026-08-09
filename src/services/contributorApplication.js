import ContributorApplication from "../model/ContributerApplication.js";
import Users from "../model/User.js";
import { AppError } from "../utils/exeption/AppError.js";
import { ErrorCode } from "../utils/exeption/ErrorCode.js";

/**
 * Người dùng gửi đơn đăng ký cộng tác viên
 */
export const createApplication = async (userId, introduction) => {
  const user = await Users.findById(userId);

  if (!user) {
    throw new AppError(ErrorCode.USER_NOT_EXISTED);
  }

  if (user.role === "contributor") {
    throw new AppError(ErrorCode.INVALID_KEY);
  }

  const application = await ContributorApplication.findOne({ userId });

  // Chưa từng gửi
  if (!application) {
    return await ContributorApplication.create({
      userId,
      introduction,
    });
  }

  // Đang chờ duyệt
  if (application.status === "PENDING") {
    throw new AppError("Đơn đăng ký của bạn đang chờ xét duyệt.", 400);
  }

  // Đã được duyệt
  if (application.status === "APPROVED") {
    throw new AppError("Bạn đã là cộng tác viên.", 400);
  }

  // Bị từ chối -> cho phép gửi lại
  application.introduction = introduction;
  application.status = "PENDING";
  application.rejectionReason = null;
  application.reviewedBy = null;
  application.reviewedAt = null;

  await application.save();

  return application;
};

/**
 * Lấy đơn của người dùng hiện tại
 */
export const getMyApplication = async (userId) => {
  return await ContributorApplication.findOne({ userId });
};

/**
 * Danh sách đơn (Admin)
 */
export const getApplications = async ({
  page = 1,
  limit = 10,
  status,
}) => {
  const filter = {};

  if (status) {
    filter.status = status;
  }

  page = Number(page);
  limit = Number(limit);

  const total = await ContributorApplication.countDocuments(filter);

  const applications = await ContributorApplication.find(filter)
    .populate("userId", "name email avatar")
    .populate("reviewedBy", "name")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    applications,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Chi tiết đơn
 */
export const getApplicationById = async (id) => {
  const application = await ContributorApplication.findById(id)
    .populate("userId", "name email avatar")
    .populate("reviewedBy", "name");

  if (!application) {
    throw new AppError("Không tìm thấy đơn đăng ký.", 404);
  }

  return application;
};

/**
 * Duyệt đơn
 */
export const approveApplication = async (applicationId, adminId) => {
  const application = await ContributorApplication.findById(applicationId);

  if (!application) {
    throw new AppError("Không tìm thấy đơn đăng ký.", 404);
  }

  if (application.status !== "PENDING") {
    throw new AppError("Đơn này đã được xử lý.", 400);
  }

  application.status = "APPROVED";
  application.reviewedBy = adminId;
  application.reviewedAt = new Date();

  await application.save();

  await Users.findByIdAndUpdate(application.userId, {
    role: "uploader",
  });

  return application;
};

/**
 * Từ chối đơn
 */
export const rejectApplication = async (
  applicationId,
  adminId,
  reason
) => {
  const application = await ContributorApplication.findById(applicationId);

  if (!application) {
    throw new AppError("Không tìm thấy đơn đăng ký.", 404);
  }

  if (application.status !== "PENDING") {
    throw new AppError("Đơn này đã được xử lý.", 400);
  }

  application.status = "REJECTED";
  application.reviewedBy = adminId;
  application.reviewedAt = new Date();
  application.rejectionReason = reason;

  await application.save();

  return application;
};