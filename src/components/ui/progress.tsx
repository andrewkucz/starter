"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Progress({ className, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root data-slot="progress" {...props}>
      <ProgressPrimitive.Track
        data-slot="progress-track"
        className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="bg-primary transition-[width]"
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  );
}

export { Progress };
