import express from "express";
import { protect } from "../middleware/authMiddleware.ts";
import {
  createCommentOnPost,
  getChildComment,
  getCommentsForPost,
} from "../controllers/commentController.ts";

const router = express.Router();

router.post("/create", protect, createCommentOnPost);

router.get("/:postId", getCommentsForPost);

// Get child comment for a comment
router.get("/child/:commentId", getChildComment);

export default router;
