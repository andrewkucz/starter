import type { ComponentProps } from "react";

import { cn } from "#/lib/utils";

export function DataList({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("overflow-hidden rounded-xl border bg-card", className)} {...props} />;
}

export function DataListRow({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex min-h-14 items-center gap-3 border-b px-4 py-2 last:border-b-0 hover:bg-muted/50",
        className,
      )}
      {...props}
    />
  );
}

export function DataListCell({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("min-w-0 flex-1", className)} {...props} />;
}
