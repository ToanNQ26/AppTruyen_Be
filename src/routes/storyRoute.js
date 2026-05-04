import express from "express";
import { upload } from "../middlewares/upload.js";
import {
  getListStory,
  getStoryBySlug,
  createStory,
  updateStory,
  uploadStoryCover,
  deleteStory,
  incrementViews,
} from "../controller/storyController.js";


const router = express.Router();

router.get("/", getListStory);
router.get("/:slug", getStoryBySlug);
router.post("/", createStory);
router.put("/:id", updateStory);
router.delete("/:id", deleteStory);
router.patch("/:id/views", incrementViews);

router.post("/:id/cover", upload.single("cover"), uploadStoryCover);

export default router;
