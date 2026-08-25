import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";

import { cn } from "#/lib/utils";

export function Logo({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn("inline-flex items-center gap-2 text-base font-bold tracking-tight", className)}
      {...props}
    >
      <span className="grid size-7 place-items-center rounded-lg bg-primary text-xs text-primary-foreground">
        S
      </span>
      Starter
    </span>
  );
}

export function LogoLink({ className }: { className?: string }) {
  return (
    <Link to="/app" aria-label="Starter home" className={cn("inline-flex no-underline", className)}>
      <Logo />
    </Link>
  );
}
