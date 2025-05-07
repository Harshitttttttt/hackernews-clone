import { db } from "../db.ts";
import { postsTable } from "../schema.ts";
import type { InsertPost, SelectPost } from "../schema.ts";

export async function getMainPagePosts() {
  try {
    return await db.select().from(postsTable);
  } catch (error) {
    console.error("Error fetching main page posts:", error);
    throw new Error("Failed to fetch posts");
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
