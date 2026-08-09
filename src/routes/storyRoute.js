import express from "express";
import { upload } from "../middlewares/upload.js";
import { verifyToken,authorize } from "../middlewares/authMiddleware.js";
import {
  getListStory,
  getStoryBySlug,
  createStory,
  updateStory,
  uploadStoryCover,
  deleteStory,
  getMyStories
} from "../controller/storyController.js";


const router = express.Router();

router.get("/", getListStory);
router.get("/my", verifyToken, authorize("admin"), getMyStories);
router.get("/:slug", getStoryBySlug);
router.post(
  "/",
  verifyToken,
  authorize("user"),
  upload.single("cover"),
  createStory,
);
router.put("/:id", updateStory);
router.delete("/:id", deleteStory);

router.post("/:id/cover", upload.single("cover"), uploadStoryCover);


export default router;
