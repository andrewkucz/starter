"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import type * as React from "react";
import { SlotRoot } from "@/components/ui/slot";
import { cn } from "@/lib/utils";

function Popover({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({
  asChild,
  ...props
}: Omit<React.ComponentProps<typeof PopoverPrimitive.Trigger>, "render"> & {
  asChild?: boolean;
}) {
  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      render={asChild ? <SlotRoot /> : undefined}
      {...props}
    />
  );
}

function PopoverContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  anchor,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Popup> &
  Pick<
    React.ComponentProps<typeof PopoverPrimitive.Positioner>,
    "side" | "sideOffset" | "align" | "anchor"
  >) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        anchor={anchor}
        className="z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "rounded-md border bg-popover p-3 text-popover-foreground shadow-md outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverContent, PopoverTrigger };
