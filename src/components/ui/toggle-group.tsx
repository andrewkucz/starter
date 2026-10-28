import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import type * as React from "react";

import { cn } from "@/lib/utils";

function ToggleGroup<Value extends string>({
  className,
  ...props
}: ToggleGroupPrimitive.Props<Value>) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      className={cn(
        "inline-flex w-fit items-center rounded-md border border-border bg-background p-0.5 shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

function ToggleGroupItem({ className, ...props }: React.ComponentProps<typeof TogglePrimitive>) {
  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-pressed:bg-accent data-pressed:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
