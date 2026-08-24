import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./netlify/database/migrations",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
});
