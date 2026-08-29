import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins/admin";
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
  user: {
    additionalFields: {
      onboardedAt: {
        type: "date",
        required: false,
        input: false,
        fieldName: "onboarded_at",
      },
    },
  },
  plugins: [admin(), tanstackStartCookies()],
});
