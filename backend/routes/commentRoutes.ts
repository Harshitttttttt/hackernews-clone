import express from "express";
import { protect } from "../middleware/authMiddleware.ts";
import {
  createCommentOnPost,
  getCommentsForPost,
} from "../controllers/commentController.ts";

const router = express.Router();

router.post("/create", protect, createCommentOnPost);

router.get("/:postId", getCommentsForPost);

export default router;
