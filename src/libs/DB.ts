import path from "node:path";
import { Client } from "pg";
import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { migrate as migratePg } from "drizzle-orm/node-postgres/migrator";
import { drizzle as drizzlePglite, type PgliteDatabase } from "drizzle-orm/pglite";
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import { PHASE_PRODUCTION_BUILD } from "next/dist/shared/lib/constants";

import * as schema from "@/models/Schema";
import { Env } from "./Env";

// Types
let client: Client | PGlite;
let drizzle: any;

/**
 * Database connection setup
 *
 * - In dev mode (with DATABASE_URL): connect to Postgres (Supabase or local).
 * - In production build: use PGlite (lightweight in-memory DB for fallback).
 */
if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD && Env.DATABASE_URL) {
  // --- Postgres (Supabase or local) ---
  client = new Client({ connectionString: Env.DATABASE_URL });

  await client.connect();

  drizzle = drizzlePg(client, { schema });

  await migratePg(drizzle, {
    migrationsFolder: path.join(process.cwd(), "migrations"),
  });
} else {
  // --- PGlite fallback (prevents multiple instances in hot reload) ---
  const globalForDb = globalThis as unknown as {
    client: PGlite;
    drizzle: PgliteDatabase<typeof schema>;
  };

  if (!globalForDb.client) {
    globalForDb.client = new PGlite();
    await globalForDb.client.waitReady;

    globalForDb.drizzle = drizzlePglite(globalForDb.client, { schema });
    await migratePglite(globalForDb.drizzle, {
      migrationsFolder: path.join(process.cwd(), "migrations"),
    });
  }

  client = globalForDb.client;
  drizzle = globalForDb.drizzle;
}

// Export Drizzle DB instance for use across app
export const db = drizzle;
