import type * as React from "react";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

// The router sets `aria-current="page"` when active and `aria-disabled` (blocking navigation)
// when `disabled`, so styling keys off those attributes. `disabled` is not valid on an anchor.
function AppAnchor({
  className,
  disabled: _disabled,
  ...props
}: React.ComponentProps<"a"> & { disabled?: boolean }) {
  return (
    <a
      className={cn(
        "text-muted-foreground transition-colors hover:text-primary aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:text-inherit aria-[current=page]:font-medium aria-[current=page]:text-primary",
        className,
      )}
      {...props}
    />
  );
}

const CreatedAppLink = createLink(AppAnchor);

export const AppLink: LinkComponent<typeof AppAnchor> = (props) => <CreatedAppLink {...props} />;
