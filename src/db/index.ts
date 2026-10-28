import { drizzle } from "drizzle-orm/node-postgres";

import { relations } from "./relations.ts";
import { ENV } from "varlock/env";

export const db = drizzle({
  connection: {
    connectionString: ENV.DATABASE_URL,
  },
  relations,
});

export * from "./app.schema.ts";

export * from "./auth.schema.ts";
