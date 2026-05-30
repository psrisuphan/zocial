import { InputHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { FloatingLabel } from "./FloatingLabel";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            placeholder=" "
            className={clsx(
              "peer w-full px-3 pt-5 pb-2 rounded bg-bg-tertiary border text-text-primary text-sm placeholder-transparent transition-colors",
              "focus:outline-none focus:border-accent",
              error
                ? "border-status-error"
                : "border-border hover:border-text-muted",
              className
            )}
            {...props}
          />
          {label && (
            <FloatingLabel htmlFor={inputId} hasError={!!error}>
              {label}
            </FloatingLabel>
          )}
        </div>
        {error && (
          <p className="text-xs text-status-error">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-text-muted">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
