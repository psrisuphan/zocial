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
      <aside
        className="relative md:w-1/2 lg:w-3/5 overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-active))" }}
      >
        {/* muting overlay — blends accent with page bg to reduce intensity */}
        <div className="absolute inset-0 bg-bg-primary/50" />
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 rounded-full bg-bg-tertiary/15 blur-3xl" />

        {/* mobile: compact header / desktop: full panel */}
        <div className="relative h-full flex flex-col justify-center px-6 py-8 md:px-12 lg:px-20">
          <div className="flex items-center gap-2 mb-2 md:mb-6">
            <span className="text-2xl md:text-4xl font-bold text-text-primary tracking-tight">
              Zocial
            </span>
          </div>
          <p className="text-sm md:text-xl text-text-secondary font-medium max-w-md">
            A clean, privacy-first chat app for everyone.
          </p>

          {/* feature highlights — desktop only */}
          <ul className="hidden md:flex flex-col gap-4 mt-10">
            {highlights.map((h) => (
              <li key={h.label} className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-accent-subtle flex items-center justify-center text-lg">
                  {h.icon}
                </span>
                <span className="text-text-primary font-medium">{h.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* ── Form panel ──────────────────────────────────────── */}
      <main className="relative flex-1 flex flex-col">
        <header className="flex justify-end p-3">
          <ThemeToggle />
        </header>
        <div className="flex-1 flex items-center justify-center px-4 pb-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </main>
    </div>
  );
}
