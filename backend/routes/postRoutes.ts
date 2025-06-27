import express from "express";
import {
  createANewPost,
  getMainPagePosts,
  getPostById,
  upvotePost,
} from "../controllers/postControllers.ts";
import { protect } from "../middleware/authMiddleware.ts";

const router = express.Router();

// Get all main page posts
router.get("/", getMainPagePosts);

// Get a particular post by ID
router.get("/:postId", getPostById);

// Create a new post
router.post("/create", protect, createANewPost);

// Upvote or Un-Upvote a post
router.get("/upvote/:postId", protect, upvotePost);

export default router;
