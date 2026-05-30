"use client";

import { useState, InputHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  hint?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const [show, setShow] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-") || "password";

    return (
      <div className="flex flex-col gap-1.5">
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={show ? "text" : "password"}
            placeholder=" "
            className={clsx(
              "peer w-full px-3 pt-5 pb-2 pr-16 rounded bg-bg-tertiary border text-text-primary text-sm placeholder-transparent transition-colors",
              "focus:outline-none focus:border-accent",
              error
                ? "border-status-error"
                : "border-border hover:border-text-muted",
              className
            )}
            {...props}
          />
          {label && (
            <label
              htmlFor={inputId}
              className={clsx(
                "absolute left-3 top-3 text-base text-text-muted pointer-events-none select-none transition-all duration-200",
                "peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-accent",
                "peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-xs",
                error && "peer-[&:not(:placeholder-shown)]:text-status-error peer-focus:text-status-error"
              )}
            >
              {label}
            </label>
          )}
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted hover:text-text-secondary transition-colors select-none"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
        {error && <p className="text-xs text-status-error">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
