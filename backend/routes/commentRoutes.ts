import express from "express";
import { protect } from "../middleware/authMiddleware.ts";
import {
  createCommentOnPost,
  getChildComment,
  getCommentById,
  getCommentsForPost,
} from "../controllers/commentController.ts";

const router = express.Router();

router.post("/create", protect, createCommentOnPost);

router.get("/:postId", getCommentsForPost);

// Get child comment for a comment
router.get("/child/:commentId", getChildComment);

// Get a comment by Id
router.get("/comment/:commentId", getCommentById);

export default router;
