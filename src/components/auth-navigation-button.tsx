import { useSession } from "@better-auth-ui/react";
import { Link, useHydrated } from "@tanstack/react-router";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/browser";

export function AuthNavigationButton({ size }: Pick<ComponentProps<typeof Button>, "size">) {
  const hydrated = useHydrated();
  const { data: session, isSuccess } = useSession(authClient, { enabled: hydrated });

  if (!hydrated || !isSuccess) return null;

  return (
    <Button asChild size={size}>
      <Link to={session ? "/dashboard" : "/sign-in"}>{session ? "Dashboard" : "Login"}</Link>
    </Button>
  );
}
