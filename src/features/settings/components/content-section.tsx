import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type ContentSectionProps = {
  title: string;
  desc: string;
  children: React.ReactNode;
  className?: string;
  hideHeading?: boolean;
};

export function ContentSection({
  title,
  desc,
  children,
  className,
  hideHeading = false,
}: ContentSectionProps) {
  return (
    <div className="flex flex-1 flex-col">
      {hideHeading ? null : (
        <>
          <div className="flex-none">
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
          <Separator className="my-4 flex-none" />
        </>
      )}
      <div className="w-full">
        <div className={cn("lg:max-w-xl", className)}>{children}</div>
      </div>
    </div>
  );
}
