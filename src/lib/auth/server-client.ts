import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { ENV } from "varlock/env";
import { ac, roles } from "@/lib/auth/permissions";
import { db } from "@/db";

// Social providers are optional; each is enabled when its credentials are configured.
const socialProviders = {
  ...(ENV.GOOGLE_CLIENT_ID &&
    ENV.GOOGLE_CLIENT_SECRET && {
      google: {
        clientId: ENV.GOOGLE_CLIENT_ID,
        clientSecret: ENV.GOOGLE_CLIENT_SECRET,
        prompt: "select_account" as const,
      },
    }),
  ...(ENV.DISCORD_CLIENT_ID &&
    ENV.DISCORD_CLIENT_SECRET && {
      discord: {
        clientId: ENV.DISCORD_CLIENT_ID,
        clientSecret: ENV.DISCORD_CLIENT_SECRET,
      },
    }),
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // Renew active sessions once per day.
  },
  emailAndPassword: {
    enabled: true,
  },
  onAPIError: {
    errorURL: "/auth-error",
  },
  socialProviders,
  account: {
    accountLinking: {
      enabled: true,
      allowDifferentEmails: true,
    },
  },
  plugins: [admin({ ac, roles, defaultRole: "user" }), tanstackStartCookies()],
});
