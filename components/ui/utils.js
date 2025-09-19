export function cn(...inputs) {
  // Simple class name joiner, no Tailwind merge needed
  return inputs.filter(Boolean).join(" ");
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
