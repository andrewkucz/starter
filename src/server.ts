import { resolve } from "node:path";

import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { FastResponse } from "srvx";

import { db } from "@/db";
import { promoteConfiguredAdminUsers } from "@/lib/auth/configured-admins";

globalThis.Response = FastResponse;

console.info("Executing database migrations");
await migrate(db, {
  migrationsFolder: resolve(process.cwd(), "migrations"),
});
void promoteConfiguredAdminUsers();

export default {
  fetch: createStartHandler(defaultStreamHandler),
};
