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
        style={{ background: "linear-gradient(145deg, #4A9E6A 0%, #2F7A4E 55%, #1E5235 100%)" }}
      >
        {/* depth blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(0,0,0,0.18)" }} />

        {/* mobile: compact header / desktop: full panel */}
        <div className="relative h-full flex flex-col justify-center px-6 py-8 md:px-12 lg:px-20">
          <div className="flex items-center gap-2 mb-2 md:mb-6">
            <span className="text-2xl md:text-4xl font-bold tracking-tight" style={{ color: "#ffffff" }}>
              Zocial
            </span>
          </div>
          <p className="text-sm md:text-xl font-medium max-w-md" style={{ color: "rgba(255,255,255,0.80)" }}>
            A clean, privacy-first chat app for everyone.
          </p>

          {/* feature highlights — desktop only */}
          <ul className="hidden md:flex flex-col gap-4 mt-10">
            {highlights.map((h) => (
              <li key={h.label} className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ background: "rgba(255,255,255,0.15)" }}>
                  {h.icon}
                </span>
                <span className="font-medium" style={{ color: "rgba(255,255,255,0.90)" }}>{h.label}</span>
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
