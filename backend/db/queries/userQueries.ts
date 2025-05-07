import { eq } from "drizzle-orm";
import { db } from "../db.ts";
import { usersTable } from "../schema.ts";
import type { InsertUser, SelectUser } from "../schema.ts";

export async function createUser(data: InsertUser) {
  const result = await db.insert(usersTable).values(data).returning();
  return result;
}

export async function checkIfUserExists(
  email: string
): Promise<SelectUser | undefined> {
  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });
    return user; // Returns the user object if found, otherwise undefined
  } catch (error) {
    console.error("Error checking if user exists:", error);
    return undefined; // Handle potential errors and return undefined
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return undefined; // Handle potential errors and return undefined
  }
}
