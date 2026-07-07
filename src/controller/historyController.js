import * as HistoryService from '../services/historyService.js';
import { ErrorCode } from '../utils/exeption/ErrorCode.js';
import { AppError } from '../utils/exeption/AppError.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getHistories = async (req, res, next) => {
  try {
    const histories = await HistoryService.getAllHistories(req.user.id);
    res.json(new ApiResponse({ result: histories }));
  } catch (err) {
    next(err);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const history = await HistoryService.getHistoryById(req.params.id);
    if (!history) throw new AppError(ErrorCode.NOT_FOUND, 'History not found');
    res.json(new ApiResponse({ result: history }));
  } catch (err) {
    next(err);
  }
};

export const createOrUpdateHistory = async (req, res, next) => {
  try {
    const { story, chapter } = req.body;
    const updated = await HistoryService.updateOrCreateHistory(req.user.id, story, chapter);
    res.json(new ApiResponse({ result: updated }));
  } catch (err) {
    next(err);
  }
};

export const deleteHistory = async (req, res, next) => {
  try {
    const deleted = await HistoryService.deleteHistory(req.params.id);
    if (!deleted) throw new AppError(ErrorCode.NOT_FOUND, 'History not found');
    res.json(new ApiResponse({ message: 'Deleted' }));
  } catch (err) {
    next(err);
  }
};

export const deleteAllHistories = async (req, res, next) => {
  try {
    await HistoryService.deleteAllHistoriesOfUser(req.user.id);
    res.json(new ApiResponse({ message: 'All histories deleted' }));
  } catch (err) {
    next(err);
  }
};
