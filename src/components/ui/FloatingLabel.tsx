import { clsx } from "clsx";

interface FloatingLabelProps {
  htmlFor?: string;
  hasError?: boolean;
  children: React.ReactNode;
}

export function FloatingLabel({ htmlFor, hasError, children }: FloatingLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        "absolute left-3 top-3 text-base text-text-muted pointer-events-none select-none transition-all duration-200",
        "peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-accent",
        "peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-xs",
        hasError && "peer-[&:not(:placeholder-shown)]:text-status-error peer-focus:text-status-error"
      )}
    >
      {children}
    </label>
  );
}
