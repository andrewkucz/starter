import { setupMutationInvalidation, shouldRetryAuthQuery } from "@better-auth-ui/core";
import { environmentManager, QueryClient } from "@tanstack/react-query";
import { handleServerError } from "@/lib/server/handle-server-error";

const networkMode = import.meta.env.DEV ? "always" : undefined;

export function getQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        networkMode,
        retry: (failureCount, error) =>
          !environmentManager.isServer() &&
          // AppError uses a code without an HTTP status.
          !("code" in error && error.code === "UNAUTHORIZED") &&
          shouldRetryAuthQuery(failureCount, error),
      },
      mutations: {
        networkMode,
        onError: handleServerError,
      },
    },
  });

  // better-auth-ui mutations (e.g. updateUser) declare which auth queries they
  // invalidate via `meta`; this is normally wired up by its AuthProvider.
  setupMutationInvalidation(queryClient);

  return queryClient;
}
