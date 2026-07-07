import * as storyViewDailyService from "../services/viewDailyService.js";
import { ApiResponse } from "../utils/apiResponse.js";

export async function increaseView(req, res, next) {
  try {
    const { storyId } = req.params;

    await storyViewDailyService.increaseView(storyId);

    res.status(200).json({
      success: true,
      message: "View updated",
    });
  } catch (error) {
    next(error);
  }
}

export async function getTopDaily(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 20;

    const data =
      await storyViewDailyService.getTopDaily(limit);

    res.json(
      new ApiResponse({
        result: data,
      })
    )
  } catch (error) {
    next(error);
  }
}

export async function getTopWeekly(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 20;

    const data =
      await storyViewDailyService.getTopWeekly(limit);

    res.json(
      new ApiResponse({
        result: data,
      })
    )
  } catch (error) {
    next(error);
  }
}

export async function getTopMonthly(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 20;

    const data =
      await storyViewDailyService.getTopMonthly(limit);

    res.json(
      new ApiResponse({
        result: data,
      })
    )
  } catch (error) {
    next(error);
  }
}