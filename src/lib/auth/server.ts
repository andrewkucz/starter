import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { Pool } from "pg";
import { getConnectionString } from "@netlify/database";

export const auth = betterAuth({
  database: new Pool({
    connectionString: getConnectionString(),
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()],
});
