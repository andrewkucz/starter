import { Link, Outlet, useRouteContext, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboardIcon,
  ListTodoIcon,
  PanelLeftIcon,
  SettingsIcon,
  UserCogIcon,
  XIcon,
} from "lucide-react";
import { createContext, use, useCallback, useEffect, useMemo, useState } from "react";
import { ENV } from "varlock/env";

import { APP_NAME, LogoLink } from "@/components/brand";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { hasRole } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const managerItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon, exact: true },
  { to: "/tasks", label: "Tasks", icon: ListTodoIcon, exact: false },
] as const;

const accountItems = [
  { to: "/account", label: "Settings", icon: SettingsIcon, exact: false },
] as const;

function navigationLinkClassName(compact: boolean) {
  return cn(
    "flex h-8 items-center overflow-hidden rounded-md text-sm text-sidebar-foreground no-underline outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring [&.active]:bg-sidebar-accent [&.active]:font-medium [&.active]:text-sidebar-accent-foreground",
    compact ? "justify-center px-2" : "gap-2 px-2",
  );
}

type ManagerSidebarContextValue = {
  expanded: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggle: () => void;
};

const ManagerSidebarContext = createContext<ManagerSidebarContextValue | null>(null);

export function ManagerSidebarTrigger({ className }: { className?: string }) {
  const sidebar = use(ManagerSidebarContext);

  if (!sidebar) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        sidebar.expanded ? "md:hidden" : undefined,
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="-mx-1"
        onClick={sidebar.toggle}
        aria-label="Open navigation"
        title="Open navigation"
      >
        <PanelLeftIcon aria-hidden="true" />
      </Button>
      <Separator orientation="vertical" className="h-4" />
    </div>
  );
}

function NavigationItems({
  compact = false,
  items = managerItems,
}: {
  compact?: boolean;
  items?: readonly ((typeof managerItems)[number] | (typeof accountItems)[number])[];
}) {
  const sidebar = use(ManagerSidebarContext);

  return items.map(({ icon: Icon, exact, ...item }) => (
    <li key={item.to}>
      <Link
        to={item.to}
        activeOptions={{ exact }}
        onClick={() => sidebar?.setMobileOpen(false)}
        title={compact ? item.label : undefined}
        className={navigationLinkClassName(compact)}
      >
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        <span className={cn("truncate", compact && "sr-only")}>{item.label}</span>
      </Link>
    </li>
  ));
}

function AdminNavigationItems({ compact = false }: { compact?: boolean }) {
  const sidebar = use(ManagerSidebarContext);

  return (
    <li>
      <Link
        to="/admin/users"
        onClick={() => sidebar?.setMobileOpen(false)}
        title={compact ? "Users" : undefined}
        className={navigationLinkClassName(compact)}
      >
        <UserCogIcon className="size-4 shrink-0" aria-hidden="true" />
        <span className={cn("truncate", compact && "sr-only")}>Users</span>
      </Link>
    </li>
  );
}

function SidebarContents({
  compact = false,
  mobile = false,
}: {
  compact?: boolean;
  mobile?: boolean;
}) {
  const sidebar = use(ManagerSidebarContext);
  const { session } = useRouteContext({ from: "/_authenticated" });
  const isAdmin = hasRole(session.user.role, "admin");

  return (
    <>
      <div className="flex h-14 shrink-0 items-center gap-1 px-2 py-3">
        <LogoLink
          to="/dashboard"
          className={cn(
            "h-8 min-w-0 flex-1 overflow-hidden rounded-md text-sidebar-foreground no-underline outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring",
            compact && "justify-center",
          )}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={cn("shrink-0", compact && "hidden")}
          onClick={sidebar?.toggle}
          aria-label={mobile ? "Close navigation" : "Collapse navigation"}
          title={mobile ? "Close navigation" : "Collapse navigation"}
        >
          {mobile ? <XIcon aria-hidden="true" /> : <PanelLeftIcon aria-hidden="true" />}
        </Button>
      </div>

      <nav aria-label="Application navigation" className="min-h-0 flex-1 overflow-y-auto px-2">
        <div className="py-2">
          <p
            className={cn(
              "h-8 px-2 text-xs leading-8 font-medium text-sidebar-foreground/70",
              compact && "sr-only",
            )}
          >
            Application
          </p>
          <ul className="space-y-1">
            <NavigationItems compact={compact} />
          </ul>
        </div>
        <div className="py-2">
          <p
            className={cn(
              "h-8 px-2 text-xs leading-8 font-medium text-sidebar-foreground/70",
              compact && "sr-only",
            )}
          >
            Account
          </p>
          <ul className="space-y-1">
            <NavigationItems compact={compact} items={accountItems} />
          </ul>
        </div>
        {isAdmin ? (
          <div className="py-2">
            <p
              className={cn(
                "h-8 px-2 text-xs leading-8 font-medium text-sidebar-foreground/70",
                compact && "sr-only",
              )}
            >
              Admin
            </p>
            <ul className="space-y-1">
              <AdminNavigationItems compact={compact} />
            </ul>
          </div>
        ) : null}
      </nav>

      <div className="shrink-0 p-2">
        <p
          className={cn(
            "px-2 pb-2 text-center font-mono text-xs text-sidebar-foreground/50",
            compact && "sr-only",
          )}
        >
          v{ENV.VITE_APP_VERSION}
        </p>
        <ProfileDropdown variant="sidebar" compact={compact} side={mobile ? "top" : "right"} />
      </div>
    </>
  );
}

export function ManagerShell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = useCallback(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setMobileOpen((open) => !open);
      return;
    }

    setExpanded((open) => {
      const nextOpen = !open;
      document.cookie = `manager_sidebar=${nextOpen}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}; samesite=lax`;
      return nextOpen;
    });
  }, []);

  useEffect(() => {
    const storedState = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("manager_sidebar="))
      ?.split("=")[1];

    if (storedState) setExpanded(storedState === "true");
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "b" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  const sidebar = useMemo(
    () => ({ expanded, mobileOpen, setMobileOpen, toggle }),
    [expanded, mobileOpen, toggle],
  );

  return (
    <ManagerSidebarContext value={sidebar}>
      <div className="flex min-h-dvh w-full bg-background">
        <a
          href="#main-content"
          className="sr-only z-50 rounded-md bg-background px-3 py-2 text-sm font-medium focus:fixed focus:top-3 focus:left-3 focus:not-sr-only focus-visible:ring-2 focus-visible:ring-ring"
        >
          Skip to main content
        </a>

        <aside
          data-state={expanded ? "expanded" : "collapsed"}
          aria-hidden={!expanded}
          inert={!expanded}
          className={cn(
            "sticky top-0 hidden h-dvh shrink-0 flex-col overflow-hidden bg-sidebar text-sidebar-foreground transition-[width,border-color] duration-200 ease-linear md:flex",
            expanded ? "w-64 border-r border-sidebar-border" : "w-0 border-r-0",
          )}
        >
          <SidebarContents />
        </aside>

        <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
          <DialogContent
            showCloseButton={false}
            className="inset-y-0 left-0 flex h-dvh w-72 max-w-[calc(100%-2rem)] translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-y-0 border-l-0 bg-sidebar p-0 text-sidebar-foreground data-closed:slide-out-to-left data-open:slide-in-from-left md:hidden"
          >
            <DialogTitle className="sr-only">Application navigation</DialogTitle>
            <DialogDescription className="sr-only">
              {`Navigate between sections of ${APP_NAME}.`}
            </DialogDescription>
            <SidebarContents mobile />
          </DialogContent>
        </Dialog>

        <section className="flex min-h-dvh min-w-0 flex-1 flex-col">
          <Outlet />
        </section>
      </div>
    </ManagerSidebarContext>
  );
}
