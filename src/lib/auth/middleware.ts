import { createMiddleware } from "@tanstack/react-start";
import { AppError } from "@/lib/server/app-error";
import { getSession } from "./session";

export const optionalAuthMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const session = await getSession();

    return next({ context: { session } });
  },
);

export const authMiddleware = createMiddleware({ type: "function" })
  .middleware([optionalAuthMiddleware])
  .server(async ({ next, context: { session } }) => {
    if (!session) {
      throw new AppError({ code: "UNAUTHORIZED", message: "Sign in to continue." });
    }

    return next({ context: { session } });
  });

export const adminMiddleware = createMiddleware({ type: "function" })
  .middleware([authMiddleware])
  .server(async ({ next, context: { session } }) => {
    const permission = await import("./server-client").then(({ auth }) =>
      auth.api.userHasPermission({
        body: {
          userId: session.user.id,
          permissions: { user: ["list"] },
        },
      }),
    );

    if (!permission.success) {
      throw new AppError({ code: "FORBIDDEN", message: "Administrator access is required." });
    }

    return next({ context: { session } });
  });
