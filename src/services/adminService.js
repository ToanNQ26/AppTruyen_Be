import User from "../model/User.js";
import Story from "../model/Story.js";
import Chapter from "../model/Chapter.js";
import ContributorApplication from "../model/ContributerApplication.js";
import * as storyViewDailyService from "./viewDailyService.js";

import { AppError } from "../utils/exeption/AppError.js";
import { ErrorCode } from "../utils/exeption/ErrorCode.js";

/**
 * =========================
 * DASHBOARD
 * =========================
 */

export const getDashboardStats = async () => {
  const [
    totalUsers,
    totalStories,
    totalChapters,
    totalContributors,
    pendingApplications,
    totalViews,
    storyStats,
    viewStats,
  ] = await Promise.all([
    // Tổng số user
    User.countDocuments(),

    // Tổng số truyện
    Story.countDocuments(),

    // Tổng số chapter
    Chapter.countDocuments(),

    // Tổng số cộng tác viên
    User.countDocuments({
      role: "uploader",
    }),

    // Tổng số đơn đang chờ duyệt
    ContributorApplication.countDocuments({
      status: "PENDING",
    }),

    // Tổng lượt xem
    Story.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$views",
          },
        },
      },
    ]),

    // Số truyện đăng trong 7 ngày
    getWeeklyStoryStats(),

    // Lượt đọc trong 7 ngày
    storyViewDailyService.getWeeklyStats(),
  ]);

  return {
    totalUsers,
    totalStories,
    totalChapters,
    totalContributors,
    pendingApplications,

    totalViews: totalViews[0]?.total || 0,

    storyStats,
    viewStats,
  };
};


/**
 * =========================
 * WEEKLY STORY STATS
 * =========================
 */

const getWeeklyStoryStats = async () => {
  const startDate = new Date();

  // 7 ngày gần nhất
  startDate.setDate(startDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  const stats = await Story.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
        },
      },
    },

    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },

        count: {
          $sum: 1,
        },
      },
    },

    {
      $project: {
        _id: 0,
        date: "$_id",
        count: 1,
      },
    },

    {
      $sort: {
        date: 1,
      },
    },
  ]);

  return stats;
};
