import "varlock/auto-load";

import { defineConfig } from "drizzle-kit";
import { ENV } from "varlock/env";

export default defineConfig({
  out: "./config/migrations",
  schema: ["./src/db/auth.schema.ts", "./src/db/app.schema.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: ENV.DATABASE_URL,
  },
});
