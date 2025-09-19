import * as React from "react";
import { cva } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const alertVariants = cva(
  "position-relative w-100 rounded border px-4 py-3 small d-grid align-items-start", // Bootstrap
  {
    variants: {
      default: "bg-light text-dark",
      destructive: "text-danger bg-light",
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Alert({ className, variant, ...props }) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "fw-bold", // Bootstrap
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted small", // Bootstrap
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
