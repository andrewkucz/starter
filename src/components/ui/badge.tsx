import type { ComponentProps } from "react";

import { cn } from "#/lib/utils";

export type BadgeProps = ComponentProps<"span"> & {
  variant?: "default" | "secondary" | "positive" | "warning";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variant === "default" && "bg-primary text-primary-foreground",
        variant === "secondary" && "bg-secondary text-secondary-foreground",
        variant === "positive" &&
          "bg-positive-100 text-positive-800 dark:bg-positive-950 dark:text-positive-200",
        variant === "warning" &&
          "bg-warning-100 text-warning-800 dark:bg-warning-950 dark:text-warning-200",
        className,
      )}
      {...props}
    />
  );
}
