import path from "node:path";
import { fileURLToPath } from "node:url";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

async function runMigrations(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to run migrations");
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql);
  const migrationsFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), "../migrations");

  await migrate(db, { migrationsFolder });
  console.log("Migrations applied successfully");
}

runMigrations().catch((error: unknown) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
