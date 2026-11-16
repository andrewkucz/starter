import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { ENV } from "varlock/env";
import { ac, roles } from "@/lib/auth/permissions";
import { db } from "@/db";

const socialProviders = {
  ...(ENV.DISCORD_CLIENT_ID &&
    ENV.DISCORD_CLIENT_SECRET && {
      discord: {
        clientId: ENV.DISCORD_CLIENT_ID,
        clientSecret: ENV.DISCORD_CLIENT_SECRET,
      },
    }),
};

export const auth = betterAuth({
  appName: "Acme",
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
  advanced: {
    // Namespaced so apps sharing a host (e.g. localhost) don't share auth cookies.
    cookiePrefix: "acme",
    ipAddress: {
      // Used for rate limiting. Dokploy's Traefik replaces any client-sent X-Forwarded-For with the
      // real client IP. If a CDN sits in front (e.g. Cloudflare), use its header (`cf-connecting-ip`).
      ipAddressHeaders: ["x-forwarded-for"],
    },
  },
  plugins: [admin({ ac, roles, defaultRole: "user" }), tanstackStartCookies()],
});
