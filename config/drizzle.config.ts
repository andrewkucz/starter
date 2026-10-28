import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: ["./src/db/auth.schema.ts", "./src/db/app.schema.ts"],
  dialect: "postgresql",
});
