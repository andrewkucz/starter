import { createFileRoute } from "@tanstack/react-router";

import { AuthNavigationButton } from "@/components/auth-navigation-button";
import { APP_NAME, LogoIcon } from "@/components/brand";

export const Route = createFileRoute("/_app/")({
  component: IndexPage,
});

function IndexPage() {
  return (
    <div className="py-16 px-8 flex flex-col place-items-center space-y-12 text-4xl">
      <LogoIcon className="size-24" />
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-center max-w-xl">{APP_NAME}</h1>
        <p className="text-center text-base text-muted-foreground max-w-md">
          TanStack Start, Better Auth, Drizzle and Postgres, ready to build on.
        </p>
      </div>
      <AuthNavigationButton size="lg" />
    </div>
  );
}
