import { Outlet, useRouterState } from "@tanstack/react-router";

import { AuthNavigationButton } from "@/components/auth-navigation-button";
import { LogoLink } from "@/components/brand";
import ThemeToggle from "@/components/theme-toggle";

export function AppShell() {
  const hideAuthNavigation = useRouterState({
    select: (state) => ["/", "/sign-in", "/sign-up"].includes(state.location.pathname),
  });

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="h-14 shrink-0 border-b bg-card">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
          <LogoLink />
          <div className="flex items-center gap-3">
            {hideAuthNavigation ? null : <AuthNavigationButton />}
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div id="main-content" className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  );
}
