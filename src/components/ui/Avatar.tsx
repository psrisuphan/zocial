import Image from "next/image";
import { clsx } from "clsx";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  xs: { px: 20, text: "text-xs" },
  sm: { px: 32, text: "text-sm" },
  md: { px: 40, text: "text-base" },
  lg: { px: 80, text: "text-2xl" },
};

function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const { px, text } = sizes[size];

  if (src) {
    return (
      <Image
        src={src}
        alt={name || "Avatar"}
        width={px}
        height={px}
        className={clsx("rounded-full object-cover flex-shrink-0", className)}
        style={{ width: px, height: px }}
      />
    );
  }

  return (
    <div
      className={clsx(
        "rounded-full flex items-center justify-center flex-shrink-0 font-semibold bg-accent-subtle text-accent select-none",
        text,
        className
      )}
      style={{ width: px, height: px }}
    >
      {getInitials(name)}
    </div>
  );
}
