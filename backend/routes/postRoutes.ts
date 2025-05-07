import express from "express";
import {
  createANewPost,
  getMainPagePosts,
} from "../controllers/postControllers.ts";
import { protect } from "../middleware/authMiddleware.ts";

const router = express.Router();

// Get all main page posts
router.get("/", getMainPagePosts);

// Create a new post
router.post("/create", protect, createANewPost);

export default router;
