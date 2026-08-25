import { Link, Outlet } from "@tanstack/react-router";
import { BookOpenIcon, LayoutDashboardIcon, UserCircleIcon, UsersIcon } from "lucide-react";

import { LogoLink } from "#/components/brand";
import ThemeToggle from "#/components/ThemeToggle";
import { Avatar } from "#/components/ui/avatar";

const managerItems = [
  { to: "/manager/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { to: "/manager/books", label: "Books", icon: BookOpenIcon },
  { to: "/manager/users", label: "Users", icon: UsersIcon },
] as const;

export function ManagerShell() {
  return (
    <div className="min-h-dvh bg-background md:grid md:grid-cols-[15rem_1fr]">
      <aside className="hidden border-r bg-sidebar md:flex md:h-dvh md:flex-col md:sticky md:top-0">
        <div className="flex h-14 items-center border-b px-4">
          <LogoLink />
        </div>
        <nav aria-label="Manager navigation" className="flex flex-1 flex-col gap-1 p-3">
          <p className="px-2 pb-1 pt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Application
          </p>
          {managerItems.map(({ icon: Icon, ...item }) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground no-underline hover:bg-sidebar-accent hover:text-sidebar-accent-foreground [&.active]:bg-sidebar-accent [&.active]:text-sidebar-accent-foreground"
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-3">
          <Link
            to="/manager/account"
            className="flex items-center gap-3 rounded-md p-2 text-sm text-foreground no-underline hover:bg-sidebar-accent"
          >
            <Avatar name="Mia Bennett" />
            <span className="min-w-0 flex-1 truncate font-medium">Mia Bennett</span>
            <UserCircleIcon className="size-4 text-muted-foreground" />
          </Link>
        </div>
      </aside>
      <section className="flex min-h-dvh min-w-0 flex-col">
        <div className="flex h-14 items-center justify-between border-b bg-card px-4 md:hidden">
          <LogoLink />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link to="/manager/account" aria-label="Account">
              <Avatar name="Mia Bennett" className="size-8" />
            </Link>
          </div>
        </div>
        <nav
          aria-label="Manager navigation"
          className="flex overflow-x-auto border-b bg-card p-2 md:hidden"
        >
          {managerItems.map(({ icon: Icon, ...item }) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground no-underline [&.active]:bg-accent [&.active]:text-foreground"
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex min-h-0 flex-1 flex-col">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
