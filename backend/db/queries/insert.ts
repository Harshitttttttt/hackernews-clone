import { db } from "../db.ts";
import { InsertUser, usersTable } from "../schema.ts";

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}
