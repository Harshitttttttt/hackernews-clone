import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  karma: integer("karma").default(0).notNull(),
  about: text("about"),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp(),
});

// export const postsTable = pgTable("posts", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   title: text("title").notNull(),
//   url: text("url"),
//   content: text("content"),
//   user_id: uuid("user_id")
//     .references(() => usersTable.id)
//     .notNull(),
//   score: bigint({ mode: "number" }).default(0).notNull(),
//   comment_count: bigint({ mode: "number" }).default(0).notNull(),
//   isDeleted: boolean("isDeleted").default(false).notNull(),
//   createdAt: timestamp().defaultNow().notNull(),
//   updatedAt: timestamp(),
// });

export const postsTable = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    url: text("url"),
    content: text("content"),
    user_id: uuid("user_id")
      .references(() => usersTable.id)
      .notNull(),
    creator_username: varchar({ length: 255 }).notNull(),
    score: bigint("score", { mode: "number" }).default(0).notNull(),
    comment_count: bigint("comment_count", { mode: "number" })
      .default(0)
      .notNull(),
    isDeleted: boolean("isDeleted").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (table) => {
    // Add options as the second argument
    return {
      // Add a check constraint: url IS NOT NULL OR content IS NOT NULL
      urlOrContentCheck: check(
        "url_or_content_present", // Constraint name
        sql`(${table.url} IS NOT NULL OR ${table.content} IS NOT NULL)` // SQL expression for the check
      ),
      // You can add other table-level constraints here if needed
    };
  }
);

export const commentsTable: any = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  user_id: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  post_id: uuid("post_id")
    .references(() => postsTable.id)
    .notNull(),
  parent_comment_id: uuid("parent_comment_id").references(
    () => (commentsTable as any).id
  ),
  score: bigint({ mode: "number" }).default(0).notNull(),
  isDeleted: boolean("isDeleted").default(false).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp(),
});

// export const postVotesTable = pgTable("post_votes", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   user_id: uuid("user_id")
//     .references(() => usersTable.id)
//     .notNull(),
//   post_id: uuid("post_id")
//     .references(() => postsTable.id)
//     .notNull(),
//   direction: integer("direction").notNull(),
//   createdAt: timestamp().defaultNow().notNull(),
// });

// export const commentVotesTable = pgTable("comment_votes", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   user_id: uuid("user_id")
//     .references(() => usersTable.id)
//     .notNull(),
//   post_id: uuid("post_id")
//     .references(() => postsTable.id)
//     .notNull(),
//   direction: integer("direction").notNull(),
//   createdAt: timestamp().defaultNow().notNull(),
// });

export const postVotesTable = pgTable(
  "post_votes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id")
      .references(() => usersTable.id)
      .notNull(),
    post_id: uuid("post_id")
      .references(() => postsTable.id)
      .notNull(),
    // direction: integer("direction").notNull(),
    isUpvote: boolean("isUpvote").notNull().default(false),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => {
    // Add options as the second argument
    return {
      // Add a composite unique constraint on user_id and post_id
      userPostUnique: unique("user_id_post_id_unique").on(
        table.user_id,
        table.post_id
      ),
    };
  }
);

export const commentVotesTable = pgTable(
  "comment_votes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id")
      .references(() => usersTable.id)
      .notNull(),
    // THIS NEEDS TO REFERENCE COMMENT_ID, NOT POST_ID
    comment_id: uuid("comment_id")
      .references(() => commentsTable.id)
      .notNull(), // Corrected column name and reference
    // direction: integer("direction").notNull(),
    isUpvote: boolean("isUpvote").notNull().default(false),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => {
    // Add options as the second argument
    return {
      // Add a composite unique constraint on user_id and comment_id
      userCommentUnique: unique("user_id_comment_id_unique").on(
        table.user_id,
        table.comment_id
      ),
    };
  }
);

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;

export type InsertComment = typeof commentsTable.$inferInsert;
export type SelectComment = typeof commentsTable.$inferSelect;
// Define a type for comments when threaded, including children
export type ThreadedComment = SelectComment & {
  children?: ThreadedComment[]; // 'children' can be an array of other threaded comments
};
