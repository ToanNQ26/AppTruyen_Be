import express from "express";

import { verifyToken, authorize } from "../middlewares/authMiddleware.js";

import {
  getDashboardStats
} from "../controller/adminController.js";

const router = express.Router();


router.use(
  verifyToken,
  authorize("admin")
);

router.get(
  "/dashboard",
  getDashboardStats
);


export default router;