import express from "express";

import {
  createApplication,
  getMyApplication,
  getApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
} from "../controller/contributorApplication.js";

import { verifyToken, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Tất cả API đều yêu cầu đăng nhập
router.use(verifyToken);

/**
 * User
 */
router.post("/", createApplication);
router.get("/me", getMyApplication);

/**
 * Admin
 */
router.get("/", authorize("admin"), getApplications);
router.get("/:id", authorize("admin"), getApplicationById);
router.patch("/:id/approve", authorize("admin"), approveApplication);
router.patch("/:id/reject", authorize("admin"), rejectApplication);

export default router;
