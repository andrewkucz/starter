import { Link } from "@tanstack/react-router";
import { BoxIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export const APP_NAME = "Acme";

export function LogoIcon({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-xs bg-primary text-primary-foreground",
        className,
      )}
      {...props}
    >
      <BoxIcon className="size-3/5" aria-hidden="true" />
    </span>
  );
}

export function Logo({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-lg md:text-sm font-bold tracking-tight",
        className,
      )}
      {...props}
    >
      <LogoIcon className="md:size-6" aria-hidden="true" />
      {APP_NAME}
    </span>
  );
}

export function LogoLink({ className, to = "/" }: { className?: string; to?: "/" | "/dashboard" }) {
  return (
    <Link
      to={to}
      aria-label={`${APP_NAME} home`}
      className={cn("inline-flex text-foreground no-underline px-1", className)}
    >
      <Logo />
    </Link>
  );
}
