// src/db/db.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema.ts";

const sql = neon(process.env.DATABASE_URL!); // assume .env is loaded
const db = drizzle(sql, { schema });

export { db };
