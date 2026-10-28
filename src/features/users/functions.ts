import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { account, db } from "@/db";
import { adminMiddleware } from "@/lib/auth/middleware";

// Linked sign-in methods for one user. Never select tokens or password hashes.
export const getUserAccounts = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .validator(z.object({ userId: z.string().min(1) }))
  .handler(({ data }) =>
    db
      .select({
        id: account.id,
        providerId: account.providerId,
        accountId: account.accountId,
        scope: account.scope,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      })
      .from(account)
      .where(eq(account.userId, data.userId))
      .orderBy(desc(account.createdAt)),
  );
