import * as React from "react";

import { Label } from "@/components/ui/label";
import { Slot } from "@/components/ui/slot";
import { cn } from "@/lib/utils";

export function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="form-item" className={cn("grid gap-2", className)} {...props} />;
}

export function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return <Label data-slot="form-label" className={className} {...props} />;
}

export function FormControl(props: React.ComponentProps<typeof Slot.Root>) {
  return <Slot.Root data-slot="form-control" {...props} />;
}

export function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="form-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function errorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return null;
}

export function FormMessage({
  errors,
  className,
  children,
  ...props
}: React.ComponentProps<"p"> & { errors?: readonly unknown[] }) {
  const body = errors?.map(errorMessage).filter(Boolean).join(", ") || children;
  if (!body) return null;

  return (
    <p
      data-slot="form-message"
      className={cn("text-sm text-destructive", className)}
      role="alert"
      {...props}
    >
      {body}
    </p>
  );
}
