import type { ComponentProps, ReactNode } from "react";

import { cn } from "#/lib/utils";

export function Page({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex min-h-0 flex-1 flex-col", className)} {...props} />;
}

export type PageHeaderProps = ComponentProps<"header"> & {
  actions?: ReactNode;
  before?: ReactNode;
};

export function PageHeader({ actions, before, children, className, ...props }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur",
        className,
      )}
      {...props}
    >
      {before}
      <div className="min-w-0 flex-1">{children}</div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function PageTitle({ className, ...props }: ComponentProps<"h1">) {
  return <h1 className={cn("truncate text-sm font-semibold", className)} {...props} />;
}

export type PageContentProps = ComponentProps<"main"> & { width?: "default" | "wide" | "narrow" };

export function PageContent({ className, width = "default", ...props }: PageContentProps) {
  return (
    <main
      className={cn(
        "mx-auto flex w-full flex-1 flex-col p-4 pb-24 md:pb-6",
        width === "default" && "max-w-4xl",
        width === "wide" && "max-w-7xl",
        width === "narrow" && "max-w-2xl",
        className,
      )}
      {...props}
    />
  );
}
