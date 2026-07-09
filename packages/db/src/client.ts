import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

export type Database = ReturnType<typeof drizzle<typeof schema>>;

export function createDb(databaseUrl: string): Database {
  return drizzle(neon(databaseUrl), { schema });
}

function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return url;
}

export const db = createDb(requireDatabaseUrl());

export function getDb(): Database {
  return db;
}
