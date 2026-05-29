import { HTMLAttributes } from "react";
import { clsx } from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export function Card({ padded = true, className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-bg-secondary rounded-lg border border-border",
        padded && "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
