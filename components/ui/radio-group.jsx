"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group@1.2.3";
import { CircleIcon } from "lucide-react";

import { cn } from "./utils";

function RadioGroup({ className, ...props }) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn(
        // Responsive grid: 1 column on mobile, 2 on sm, 3 on md+
        "grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
        className
      )}
      {...props}
    />
  );
}

function RadioGroupItem({ className, ...props }) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        // Responsive size: smaller on mobile, larger on desktop
        "border-input text-primary focus-visible-ring focus-visible-ring/50 aria-invalid-destructive/20 dark-invalid-destructive/40 aria-invalid-destructive dark-input/30 aspect-square size-4 sm:size-5 md:size-6 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible-[3px] disabled-not-allowed disabled-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 sm:size-2.5 md:size-3 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
