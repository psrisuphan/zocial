"use client";

import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui";

const WORDMARK = "Zocial";
const TYPING_SPEED = 110; // ms per character

const highlights = [
  { icon: "🔒", label: "End-to-end encrypted DMs" },
  { icon: "💬", label: "Group chats & channels" },
  { icon: "📸", label: "Share photos with friends" },
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  const [typed, setTyped]     = useState("");
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setTyped(WORDMARK.slice(0, i));
      if (i >= WORDMARK.length) {
        clearInterval(timer);
        // small pause then mark done so tagline + list animate in
        setTimeout(() => setTypingDone(true), 200);
      }
    }, TYPING_SPEED);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row animate-gradient-shift"
      style={{
        backgroundImage: "linear-gradient(-45deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-primary) 100%)",
        backgroundSize: "200% 200%",
      }}
    >
      {/* ── Brand panel ─────────────────────────────────────── */}
      <aside
        className="relative hidden md:flex md:w-1/2 lg:w-3/5 flex-col justify-center overflow-hidden px-12 lg:px-20 animate-gradient-shift"
        style={{
          backgroundImage: "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 50%, var(--bg-secondary) 100%)",
          backgroundSize: "200% 200%",
        }}
      >
        {/* subtle accent glow */}
        <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-accent opacity-[0.06] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-accent opacity-[0.04] blur-3xl" />

        <div className="relative">
          {/* typing wordmark */}
          <span className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-accent">
            {typed}
            <span
              className={[
                "inline-block w-[3px] h-9 lg:h-11 bg-accent align-middle ml-0.5 -mb-0.5 rounded-sm",
                typingDone ? "opacity-0 transition-opacity duration-700" : "animate-blink",
              ].join(" ")}
            />
          </span>

          {/* tagline — always rendered, fades in after typing */}
          <p
            className="font-display italic mt-3 text-lg text-text-secondary max-w-sm leading-relaxed transition-all duration-700 ease-out"
            style={{
              opacity: typingDone ? 1 : 0,
              transform: typingDone ? "translateY(0)" : "translateY(8px)",
            }}
          >
            A clean, privacy-first chat app for everyone.
          </p>

          {/* feature list — always rendered, staggered transitions */}
          <ul className="flex flex-col gap-3 mt-10">
            {highlights.map((h, i) => (
              <li
                key={h.label}
                className="flex items-center gap-3 transition-all duration-500 ease-out"
                style={{
                  opacity: typingDone ? 1 : 0,
                  transform: typingDone ? "translateX(0)" : "translateX(-10px)",
                  transitionDelay: typingDone ? `${i * 120}ms` : "0ms",
                }}
              >
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
          <span className="md:hidden text-lg font-bold text-accent font-display">{WORDMARK}</span>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center px-4 pb-12">
          <div className="w-full max-w-sm animate-fade-in-up">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
