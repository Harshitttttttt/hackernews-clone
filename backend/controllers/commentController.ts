import asyncHandler from "express-async-handler";
import type { Response, Request, NextFunction, RequestHandler } from "express";
import type { InsertComment, SelectUser } from "../db/schema.ts";
import {
  createCommentOnAPost,
  getAllCommentsForAPost,
  GetChildComment,
  GetCommentById,
} from "../db/queries/commentQueries.ts";
import { buildCommentTree } from "../utils/commentTree.ts";

// @desc Create a new comment on a post
// @route POST /api/comments/create
// @access Private

const createCommentOnPost: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

      const commentorUsername = req.user?.username;
      if (!commentorUsername) {
        res.status(401).json({ message: "Not authorized" });
        return;
      }

      const commentData: InsertComment = {
        content: content,
        post_id: postId,
        user_id: userId,
        commentor_username: commentorUsername,
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

// @desc Get a comments immediate child
// @route GET /api/comments/child/:commentId
// @access Public

const getChildComment = asyncHandler(async (req, res, next) => {
  const commentId = req.params.commentId;

  if (!commentId) {
    res.status(400).json({
      message: "CommentId not found",
    });
    return;
  }

  const childComment = await GetChildComment(commentId);

  if (!childComment) {
    res.json(400).json({
      message: "Error fetching child comment",
    });
    return;
  }

  res.status(200).json({
    message: "Child fetched successfully",
    comment: childComment,
  });
});

// @desc Get a comment by its Id
// @route GET /api/comments/:commentId
// @access Private

const getCommentById = asyncHandler(async (req, res, next) => {
  const commentId = req.params.commentId;

  if (!commentId) {
    res.status(400).json({
      message: "Error fetching the comment",
    });
  }

  const comment = await GetCommentById(commentId);
  if (!comment) {
    res.status(400).json({
      message: "Error fetching the comment from DB",
    });
  }

  res.status(200).json(comment);
});

export {
  createCommentOnPost,
  getCommentsForPost,
  getChildComment,
  getCommentById,
};
