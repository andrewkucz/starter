import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { auth } from "./server-client";

// Public sign-in metadata only. Never return provider options or credentials.
const getAuthProviders = createServerFn({ method: "GET" }).handler(async () => {
  const context = await auth.$context;

  return context.socialProviders.map(({ id, name }) => ({ id, displayName: name }));
});

export const authProvidersQuery = queryOptions({
  queryKey: ["auth", "providers"],
  queryFn: () => getAuthProviders(),
  staleTime: 5 * 60 * 1000,
});
