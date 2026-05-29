import { clsx } from "clsx";

export interface PasswordStrength {
  minLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
}

export function checkPassword(password: string): PasswordStrength {
  return {
    minLength:    password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber:    /[0-9]/.test(password),
  };
}

export function isPasswordValid(strength: PasswordStrength): boolean {
  return Object.values(strength).every(Boolean);
}

interface PasswordRequirementsProps {
  password: string;
  visible: boolean;
}

const requirements = [
  { key: "minLength" as const,    label: "At least 8 characters" },
  { key: "hasUppercase" as const, label: "At least 1 uppercase letter" },
  { key: "hasNumber" as const,    label: "At least 1 number" },
];

export function PasswordRequirements({ password, visible }: PasswordRequirementsProps) {
  if (!visible) return null;

  const strength = checkPassword(password);

  return (
    <ul className="flex flex-col gap-1 mt-1">
      {requirements.map(({ key, label }) => {
        const met = strength[key];
        return (
          <li key={key} className={clsx("flex items-center gap-2 text-xs", met ? "text-accent" : "text-text-muted")}>
            <span className="w-3.5 text-center">{met ? "✓" : "○"}</span>
            {label}
          </li>
        );
      })}
    </ul>
  );
}
