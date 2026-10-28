import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { SlotRoot } from "@/components/ui/slot";

function Collapsible({
  asChild,
  ...props
}: Omit<React.ComponentProps<typeof CollapsiblePrimitive.Root>, "render"> & {
  asChild?: boolean;
}) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      render={asChild ? <SlotRoot /> : undefined}
      {...props}
    />
  );
}

function CollapsibleTrigger({
  asChild,
  ...props
}: Omit<React.ComponentProps<typeof CollapsiblePrimitive.Trigger>, "render"> & {
  asChild?: boolean;
}) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      render={asChild ? <SlotRoot /> : undefined}
      {...props}
    />
  );
}

function CollapsibleContent({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Panel>) {
  return <CollapsiblePrimitive.Panel data-slot="collapsible-content" {...props} />;
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
