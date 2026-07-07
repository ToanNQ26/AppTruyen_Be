import express from "express";
import * as viewDailyController from "../controller/viewDailyController.js";

const router = express.Router();

// Tăng lượt xem
router.post(
  "/:storyId/view",
  viewDailyController.increaseView
);

// Top ngày
router.get(
  "/ranking/day",
  viewDailyController.getTopDaily
);

// Top tuần
router.get(
  "/ranking/week",
  viewDailyController.getTopWeekly
);

// Top tháng
router.get(
  "/ranking/month",
  viewDailyController.getTopMonthly
);

export default router;