import asyncHandler from "express-async-handler";
import type { Response, Request, NextFunction, RequestHandler } from "express";
import type { InsertComment, SelectUser } from "../db/schema.ts";
import {
  createCommentOnAPost,
  getAllCommentsForAPost,
} from "../db/queries/commentQueries.ts";
import { buildCommentTree } from "../utils/commentTree.ts";

// @desc Create a new comment on a post
// @route POST /api/comments/create
// @access Private

const createCommentOnPost: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.log("Hitting createCommentOnPost endpoint");
    try {
      const { postId, content, parent_comment_id } = req.body;
      const userId = req.user?.id;

      if (!userId || !postId || !content) {
        // You might want a more specific error for each missing field
        res.status(400).json({
          message: "Missing required fields: userId, postId, or content.",
        });
        return;
      }

      const commentData: InsertComment = {
        content: content,
        post_id: postId,
        user_id: userId,
      };

      if (parent_comment_id) {
        commentData.parent_comment_id = parent_comment_id;
      }

      const [comment]: any = await createCommentOnAPost(commentData);

      if (comment) {
        res.status(201).json({
          message: "Comment created successfully",
          comment: comment,
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

// @desc Fetch all comments for a post
// @route GET /api/comments/:postId
// @access Public

const getCommentsForPost: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.log("Hitting getCommentsForPost endpoint");
    try {
      const postId = req.params.postId;
      if (!postId) {
        res.status(400).json({ message: "Post ID is required in the URL." });
        return;
      }

      // const comments = await getAllCommentsForAPost(postId);

      // 1. Fetch all comments for the post (flat list)
      const flatComments = await getAllCommentsForAPost(postId);

      // 2. Transform the flat list into a threaded structure
      const threadedComments = buildCommentTree(flatComments);

      console.log("Coming from getCommentsForPost in commentController.ts");
      console.log("Threaded comments:", threadedComments);

      if (threadedComments) {
        res.status(201).json({
          message: "Comments fetched successfully",
          comments: threadedComments,
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

export { createCommentOnPost, getCommentsForPost };
