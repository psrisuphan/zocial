import { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={clsx(
        "inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer",
        {
          // variants
          "bg-accent text-bg-tertiary hover:bg-accent-hover active:bg-accent-active":
            variant === "primary",
          "bg-transparent text-text-secondary hover:bg-bg-hover hover:text-text-primary":
            variant === "ghost",
          "bg-status-error/10 text-status-error hover:bg-status-error/20":
            variant === "danger",
          // sizes
          "text-xs px-3 py-1.5 h-7": size === "sm",
          "text-sm px-4 py-2 h-9":   size === "md",
          "text-base px-5 py-2.5 h-11": size === "lg",
          // full width
          "w-full": fullWidth,
          // disabled
          "opacity-40 cursor-not-allowed pointer-events-none": disabled,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
