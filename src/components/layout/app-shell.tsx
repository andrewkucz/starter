import { Link, Outlet } from "@tanstack/react-router";
import { BookOpenIcon, HouseIcon, UserCircleIcon } from "lucide-react";

import { LogoLink } from "#/components/brand";
import ThemeToggle from "#/components/ThemeToggle";
import { cn } from "#/lib/utils";

const items = [
  { to: "/app", label: "Home", icon: HouseIcon, exact: true },
  { to: "/app/books", label: "Books", icon: BookOpenIcon, exact: false },
  { to: "/app/account", label: "Account", icon: UserCircleIcon, exact: false },
] as const;

function NavItems({ mobile = false }: { mobile?: boolean }) {
  return items.map(({ icon: Icon, exact, ...item }) => (
    <Link
      key={item.to}
      to={item.to}
      activeOptions={{ exact }}
      className={cn(
        "group flex items-center rounded-md text-muted-foreground no-underline transition-colors hover:bg-accent hover:text-foreground [&.active]:text-foreground",
        mobile
          ? "flex-1 flex-col justify-center gap-1 py-2 text-[0.65rem]"
          : "gap-2 px-3 py-2 text-sm font-medium",
      )}
    >
      <Icon
        className={cn(mobile ? "size-5" : "size-4", "opacity-60 group-[.active]:opacity-100")}
      />
      {item.label}
    </Link>
  ));
}

export function AppShell() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="hidden h-14 shrink-0 border-b bg-card md:block">
        <div className="mx-auto flex h-full max-w-4xl items-center justify-between px-4">
          <LogoLink />
          <nav aria-label="Primary navigation" className="flex items-center gap-1">
            <NavItems />
          </nav>
          <ThemeToggle />
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </div>
      <nav
        aria-label="Primary navigation"
        className="fixed inset-x-0 bottom-0 z-30 flex h-16 border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <NavItems mobile />
      </nav>
    </div>
  );
}
