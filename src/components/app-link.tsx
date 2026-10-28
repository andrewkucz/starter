import type * as React from "react";
import { Link as RouterLink } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type AppLinkProps = React.ComponentProps<typeof RouterLink> & {
  active?: boolean;
  disabled?: boolean;
};

export function AppLink({
  active = false,
  disabled = false,
  className,
  onClick,
  tabIndex,
  ...props
}: AppLinkProps) {
  return (
    <RouterLink
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "transition-colors hover:text-primary aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:text-inherit aria-[current=page]:font-medium aria-[current=page]:text-primary",
        active === false && "text-muted-foreground",
        className,
      )}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();

          return;
        }

        onClick?.(event);
      }}
      tabIndex={disabled ? -1 : tabIndex}
      {...props}
    />
  );
}
