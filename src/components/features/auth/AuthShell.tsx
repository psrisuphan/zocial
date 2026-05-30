import { ThemeToggle } from "@/components/ui";

const highlights = [
  { icon: "🔒", label: "End-to-end encrypted DMs" },
  { icon: "💬", label: "Group chats & channels" },
  { icon: "📸", label: "Share photos with friends" },
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg-primary">
      {/* ── Brand panel ─────────────────────────────────────── */}
      <aside className="relative hidden md:flex md:w-1/2 lg:w-3/5 flex-col justify-center overflow-hidden bg-bg-secondary px-12 lg:px-20">
        {/* subtle accent glow in corner */}
        <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-accent opacity-[0.06] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-accent opacity-[0.04] blur-3xl" />

        <div className="relative">
          {/* wordmark */}
          <span className="text-4xl lg:text-5xl font-bold tracking-tight text-accent">
            Zocial
          </span>
          <p className="mt-3 text-lg text-text-secondary max-w-sm leading-relaxed">
            A clean, privacy-first chat app for everyone.
          </p>

          {/* feature highlights */}
          <ul className="flex flex-col gap-3 mt-10">
            {highlights.map((h) => (
              <li key={h.label} className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-accent-subtle flex items-center justify-center text-base shrink-0">
                  {h.icon}
                </span>
                <span className="text-sm text-text-secondary">{h.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* ── Form panel ──────────────────────────────────────── */}
      <main className="relative flex-1 flex flex-col bg-bg-primary">
        <header className="flex items-center justify-between px-4 py-3">
          {/* wordmark visible only on mobile (panel is hidden) */}
          <span className="md:hidden text-lg font-bold text-accent">Zocial</span>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center px-4 pb-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </main>
    </div>
  );
}
