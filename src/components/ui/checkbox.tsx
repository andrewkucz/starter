"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Checkbox({
  className,
  checked,
  ...props
}: Omit<React.ComponentProps<typeof CheckboxPrimitive.Root>, "checked"> & {
  checked?: boolean | "indeterminate";
}) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer inline-flex size-5 shrink-0 items-center justify-center rounded-[4px] border-2 border-muted-foreground bg-background shadow-xs transition-[border-color,background-color,box-shadow] enabled:cursor-pointer enabled:hover:border-primary outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-disabled:cursor-not-allowed data-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:aria-invalid:ring-destructive/40",
        className,
      )}
      checked={checked === "indeterminate" ? false : checked}
      indeterminate={checked === "indeterminate"}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
