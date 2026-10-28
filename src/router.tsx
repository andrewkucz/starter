import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { getPublicDynamicEnv, setPublicDynamicEnv } from "varlock/env";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { getContext } from "@/lib/server/context";

export function getRouter() {
  const context = getContext();

  const router = createTanStackRouter({
    routeTree,
    context,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    dehydrate: () => ({
      publicDynamicEnv: getPublicDynamicEnv(),
    }),
    hydrate: (dehydrated) => {
      setPublicDynamicEnv(dehydrated.publicDynamicEnv);
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: context.queryClient,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
