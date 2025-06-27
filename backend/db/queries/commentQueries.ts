import { eq, asc } from "drizzle-orm";
import { db } from "../db.ts";
import { commentsTable } from "../schema.ts";
import type { InsertComment, SelectComment } from "../schema.ts";

export async function createCommentOnAPost(commentData: InsertComment) {
  try {
    const response = await db
      .insert(commentsTable)
      .values(commentData)
      .returning();
    return response;
  } catch (error) {
    console.error("Error creating a new comment:", error);
    throw new Error("Failed to create comment");
  }
}

export async function getAllCommentsForAPost(
  postId: string
): Promise<SelectComment[]> {
  try {
    const result = await db
      .select()
      .from(commentsTable)
      .where(eq(commentsTable.post_id, postId))
      .orderBy(asc(commentsTable.createdAt)); // It's good practice to order results
    return result as SelectComment[]; // Type assertion for safety;
  } catch (error) {
    console.error("Error fetching comments for post:", error);
    throw new Error("Failed to fetch comments");
  }
}

export async function GetChildComment(
  commentId: string
): Promise<SelectComment[]> {
  try {
    return await db
      .select()
      .from(commentsTable)
      .where(eq(commentsTable.parent_comment_id, commentId));
  } catch (error) {
    console.error("Error fetching child comment :(");
    throw error;
  }
}
