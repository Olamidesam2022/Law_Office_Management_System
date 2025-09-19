import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames = {},
  showOutsideDays = true,
  ...props
}) {
  const mergedClassNames = {
    months: "row g-2", // Bootstrap row with gap
    month: "d-flex flex-column gap-4", // Bootstrap flex column
    caption:
      "d-flex justify-content-center pt-1 position-relative align-items-center w-100",
    caption_label: "fs-6 fw-medium",
    nav: "d-flex align-items-center gap-1",
    nav_button: cn("btn btn-outline-secondary btn-sm p-0 opacity-50"),
    nav_button_previous: "position-absolute start-0",
    nav_button_next: "position-absolute end-0",
    table: "w-100 border-collapse",
    head_row: "d-flex",
    head_cell: "text-muted rounded w-8 fw-normal fs-6",
    row: "d-flex w-100 mt-2",
    cell: cn(
      "position-relative p-0 text-center fs-6",
      props.mode === "range" ? "border border-primary" : "border"
    ),
    day: cn("btn btn-light btn-sm p-0 fw-normal"),
    day_range_start: "bg-primary text-white",
    day_range_end: "bg-primary text-white",
    day_selected: "bg-primary text-white",
    day_today: "bg-info text-white",
    day_outside: "text-muted",
    day_disabled: "text-muted opacity-50",
    day_range_middle: "bg-info text-white",
    day_hidden: "invisible",
    ...classNames,
  };
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={mergedClassNames}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
