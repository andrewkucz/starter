"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import type * as React from "react";
import { SlotRoot } from "@/components/ui/slot";
import { cn } from "@/lib/utils";

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({
  asChild,
  ...props
}: Omit<React.ComponentProps<typeof TooltipPrimitive.Trigger>, "render"> & {
  asChild?: boolean;
}) {
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      render={asChild ? <SlotRoot /> : undefined}
      {...props}
    />
  );
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 6,
  align = "center",
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Popup> &
  Pick<React.ComponentProps<typeof TooltipPrimitive.Positioner>, "side" | "sideOffset" | "align">) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        className="z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            className,
          )}
          {...props}
        />
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipTrigger };
