import { definePlugin } from "nitro";
import { migrate } from "drizzle-orm/node-postgres/migrator";

import { db } from "@/db";

// Applies pending migrations before the production server accepts requests (Nitro holds requests
// until async plugins finish). In development, run `vp run db:migrate` instead.
export default definePlugin(async () => {
  if (process.env.NODE_ENV !== "production") return;

  try {
    await migrate(db, { migrationsFolder: "config/migrations" });
  } catch (error) {
    console.error("Database migration failed", error);
    process.exit(1);
  }
});
