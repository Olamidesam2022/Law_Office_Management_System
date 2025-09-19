import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "btn d-inline-flex align-items-center justify-content-center gap-2 rounded text-sm fw-medium transition disabled",
  {
    variants: {
      variant: {
        default: "btn-primary",
        destructive: "btn-danger",
        outline: "btn-outline-dark",
        secondary: "btn-secondary",
        ghost: "btn-light border-0",
        link: "btn-link",
      },
      size: {
        default: "btn",
        sm: "btn-sm",
        lg: "btn-lg",
        icon: "btn btn-icon",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
