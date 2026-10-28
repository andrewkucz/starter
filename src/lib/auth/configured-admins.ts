import { eq, inArray, sql } from "drizzle-orm";
import { db, user } from "@/db";
import { ENV } from "varlock/env";
import { parseAdminEmails } from "./configured-admin-emails";

export async function promoteConfiguredAdminUsers() {
  try {
    const adminEmails = parseAdminEmails(ENV.ADMIN_EMAILS);

    if (adminEmails.length === 0) return;

    const configuredUsers = await db
      .select({ id: user.id, role: user.role })
      .from(user)
      .where(inArray(sql<string>`lower(${user.email})`, adminEmails));

    await db.transaction(async (tx) => {
      for (const configuredUser of configuredUsers) {
        const roles = new Set(
          (configuredUser.role ?? "user")
            .split(",")
            .map((role) => role.trim())
            .filter(Boolean),
        );

        if (roles.has("admin")) continue;

        roles.add("admin");
        await tx
          .update(user)
          .set({ role: [...roles].join(","), updatedAt: new Date() })
          .where(eq(user.id, configuredUser.id));
      }
    });
  } catch (e) {
    console.error("Failed to promote admin users", e);
  }
}
