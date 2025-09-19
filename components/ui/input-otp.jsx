"use client";

import * as React from "react";
import { MinusIcon } from "lucide-react";
import { cn } from "./utils";

function InputOtp({ length = 6, value = "", onChange, className, ...props }) {
  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    let newValue = value.split("");
    newValue[idx] = val;
    onChange(newValue.join(""));
  };

  return (
    <div className={cn("flex gap-2", className)} {...props}>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[idx] || ""}
          onChange={(e) => handleChange(e, idx)}
          className="w-10 h-10 text-center border rounded"
        />
      ))}
      <MinusIcon className="hidden" />
    </div>
  );
}

export { InputOtp };
