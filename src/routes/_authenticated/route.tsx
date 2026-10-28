import { createFileRoute, redirect } from "@tanstack/react-router";

import { ManagerShell } from "@/components/layout/manager-shell";
import { getSession } from "@/lib/auth/session";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const session = await getSession();

    if (!session) {
      throw redirect({ to: "/sign-in", search: { redirect: location.href } });
    }

    return { session };
  },
  component: ManagerShell,
});
