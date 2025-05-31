import type { Response, Request, NextFunction, RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { db } from "../db/db.ts";
import { postsTable } from "../db/schema.ts";
import { CreatePostSchema } from "../zod/schemas/post.schema.ts";
import {
  createPost,
  handlePostUpvote,
  testUpvote,
} from "../db/queries/postQueries.ts";

// @desc Fetch all main page posts
// @route GET /api/posts/
// @access Public

const getMainPagePosts: RequestHandler = asyncHandler(
  async (req, res, next) => {
    console.log("Hitting getMainPagePosts endpoint");
    const posts = await db.select().from(postsTable);
    res.status(200).json(posts);
    try {
    } catch (error) {
      console.error("Error fetching main page posts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// @desc Create a new post
// @route POST /api/posts/create
// @access Private

const createANewPost: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.log("Hitting createANewPost endpoint");
    try {
      const validated = CreatePostSchema.parse(req.body);
      const { title, url, content } = validated;

      const userId = req.user?.id;
      console.log("User ID from request:", userId);

      if (!userId) {
        res.status(401).json({ message: "Not authorized" });
        return;
      }

      const creatorUsername = req.user?.username;
      if (!creatorUsername) {
        res.status(401).json({ message: "Not authorized" });
        return;
      }

      const newPost = {
        title: title,
        url: url,
        content: content,
        user_id: userId,
        creator_username: creatorUsername,
      };

      const [post] = await createPost(newPost);

      if (post) {
        res.status(201).json({
          message: "Post created successfully",
          post: post,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          message: error.message,
        });
      }
    }
  }
);

// @desc Upvote or Un-Upvote a post
// @route GET /api/posts/upvote/:postId
// @access Private

const upvotePost: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const postId = req.params.postId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    try {
      await handlePostUpvote(userId, postId);
      res.status(200).json({ message: "Post upvoted successfully" });
    } catch (error) {
      console.error("Error upvoting post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { getMainPagePosts, createANewPost, upvotePost };
