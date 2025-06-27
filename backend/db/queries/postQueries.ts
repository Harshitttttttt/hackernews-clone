import { and, eq, sql } from "drizzle-orm";
import { db } from "../db.ts";
import { postsTable, postVotesTable } from "../schema.ts";
import type { InsertPost, SelectPost } from "../schema.ts";

export async function getMainPagePosts() {
  try {
    return await db.select().from(postsTable);
  } catch (error) {
    console.error("Error fetching main page posts:", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function getPost(postId: string) {
  try {
    return await db.select().from(postsTable).where(eq(postsTable.id, postId));
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw new Error("Failed to fetch post");
  }
}

export async function createPost(postData: InsertPost) {
  try {
    const result = await db.insert(postsTable).values(postData).returning();
    return result;
  } catch (error) {
    console.error("Error creating a new post:", error);
    throw new Error("Failed to create post");
  }
}

export async function testUpvote() {
  console.log("Triggering testUpvote function");
}

export async function handlePostUpvote(userId: string, postId: string) {
  console.log(`Handling upvote for user ${userId} on post ${postId}`);
  let scoreChange = 0;

  try {
    const [existingVote] = await db
      .select()
      .from(postVotesTable)
      .where(
        and(
          eq(postVotesTable.user_id, userId),
          eq(postVotesTable.post_id, postId)
        )
      );

    if (existingVote) {
      console.log(`User ${userId} is un-upvoting comment ${postId}`);
      await db
        .delete(postVotesTable)
        .where(
          and(
            eq(postVotesTable.user_id, userId),
            eq(postVotesTable.post_id, postId)
          )
        );
      scoreChange = -1;
    } else {
      console.log(`User ${userId} is upvoting comment ${postId}`);
      await db.insert(postVotesTable).values({
        user_id: userId,
        post_id: postId,
        isUpvote: true,
      });
      scoreChange = 1;
    }

    if (scoreChange !== 0) {
      await db
        .update(postsTable)
        .set({
          score: sql`${postsTable.score} + ${scoreChange}`,
        })
        .where(eq(postsTable.id, postId));
    }
  } catch (error) {
    console.error("Error in handleCommentUpvote:", error);
  }
}
