import type { ComponentProps } from "react";

import { cn, initials } from "#/lib/utils";

export type AvatarProps = ComponentProps<"span"> & { name?: string | null };

export function Avatar({ className, name, ...props }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700 dark:bg-neutral-700 dark:text-neutral-100",
        className,
      )}
      {...props}
    >
      <span aria-hidden>{initials(name)}</span>
      <span className="sr-only">{name || "User"}</span>
    </span>
  );
}
