import { clsx } from "clsx";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-3.5 h-3.5 border-[1.5px]",
  md: "w-5 h-5 border-2",
  lg: "w-7 h-7 border-2",
};

export function Spinner({ size = "sm", className }: SpinnerProps) {
  return (
    <div
      className={clsx(
        "rounded-full border-current border-t-transparent animate-spin flex-shrink-0",
        sizes[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
