import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "badge d-inline-flex align-items-center justify-content-center border rounded px-2 py-1 text-bg-primary fw-medium gap-1 overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-white border-0",
        secondary: "bg-secondary text-white border-0",
        destructive: "bg-danger text-white border-0",
        outline: "bg-light text-dark border border-dark",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
