import { useRender } from "@base-ui/react/use-render";
import * as React from "react";

type SlotProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  children?: React.ReactNode;
};

const SlotRoot = React.forwardRef<HTMLElement, SlotProps>(function SlotRoot(
  { children, ...props },
  ref,
) {
  if (!React.isValidElement(children)) {
    throw new Error("Slot requires a single React element child.");
  }

  return useRender({
    defaultTagName: "span",
    render: children,
    ref,
    props,
  });
});

const Slot = { Root: SlotRoot };

export { Slot, SlotRoot };
