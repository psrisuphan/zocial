"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui";

const WORDMARK = "Zocial";
const TYPING_SPEED = 110;

const loginHighlights = [
  { icon: "🔒", label: "End-to-end encrypted DMs" },
  { icon: "💬", label: "Group chats & channels" },
  { icon: "📸", label: "Share photos with friends" },
];

const signupHighlights = [
  {
    title: "Your privacy, guaranteed",
    description:
      "Every direct message is end-to-end encrypted — only you and the person you're talking to can read it.",
  },
  {
    title: "Connect with the people you care about",
    description:
      "Add friends, create group chats, and keep everyone close — all in one place.",
  },
  {
    title: "Share your moments",
    description:
      "Send photos and relive memories with the friends and family closest to you.",
  },
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const isSignup  = pathname === "/auth/signup";

  const [typed,          setTyped]          = useState("");
  const [ready,          setReady]          = useState(false);
  const [featureIndex,   setFeatureIndex]   = useState(0);
  const [featureVisible, setFeatureVisible] = useState(true);

  // Reset and re-run intro animation on every page switch
  useEffect(() => {
    setTyped("");
    setReady(false);
    setFeatureIndex(0);
    setFeatureVisible(true);

    if (isSignup) {
      // Signup: no typing — just wait one tick so CSS transitions register
      const t = setTimeout(() => setReady(true), 80);
      return () => clearTimeout(t);
    }

    // Login: type out the wordmark
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setTyped(WORDMARK.slice(0, i));
      if (i >= WORDMARK.length) {
        clearInterval(timer);
        setTimeout(() => setReady(true), 200);
      }
    }, TYPING_SPEED);
    return () => clearInterval(timer);
  }, [isSignup]);

  // Rotate signup features with a smooth fade-out → swap → fade-in
  useEffect(() => {
    if (!isSignup || !ready) return;
    const interval = setInterval(() => {
      setFeatureVisible(false);
      setTimeout(() => {
        setFeatureIndex((prev) => (prev + 1) % signupHighlights.length);
        setFeatureVisible(true);
      }, 450);
    }, 4500);
    return () => clearInterval(interval);
  }, [isSignup, ready]);

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
          {isSignup ? (
            /* ── Signup header — static, fades in ── */
            <h1
              className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-accent transition-all duration-700 ease-out"
              style={{
                opacity:   ready ? 1 : 0,
                transform: ready ? "translateY(0)" : "translateY(10px)",
              }}
            >
              Join Us!
            </h1>
          ) : (
            /* ── Login header — typing animation ── */
            <span className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-accent">
              {typed}
              <span
                className={[
                  "inline-block w-[3px] h-9 lg:h-11 bg-accent align-middle ml-0.5 -mb-0.5 rounded-sm",
                  ready ? "opacity-0 transition-opacity duration-700" : "animate-blink",
                ].join(" ")}
              />
            </span>
          )}

          {/* Tagline */}
          <p
            className="font-display italic mt-3 text-lg text-text-secondary max-w-sm leading-relaxed transition-all duration-700 ease-out"
            style={{
              opacity:         ready ? 1 : 0,
              transform:       ready ? "translateY(0)" : "translateY(8px)",
              transitionDelay: ready ? "100ms" : "0ms",
            }}
          >
            {isSignup
              ? "Join and start chatting on Zocial."
              : "A clean, privacy-first chat app for everyone."}
          </p>

          {/* ── Login: static staggered list ── */}
          {!isSignup && (
            <ul className="flex flex-col gap-3 mt-10">
              {loginHighlights.map((h, i) => (
                <li
                  key={h.label}
                  className="flex items-center gap-3 transition-all duration-500 ease-out"
                  style={{
                    opacity:         ready ? 1 : 0,
                    transform:       ready ? "translateX(0)" : "translateX(-10px)",
                    transitionDelay: ready ? `${200 + i * 120}ms` : "0ms",
                  }}
                >
                  <span className="w-9 h-9 rounded-lg bg-accent-subtle flex items-center justify-center text-base shrink-0">
                    {h.icon}
                  </span>
                  <span className="text-sm text-text-secondary">{h.label}</span>
                </li>
              ))}
            </ul>
          )}

          {/* ── Signup: rotating feature card ── */}
          {isSignup && (
            <div className="mt-12 min-h-[110px]">
              <div
                className="transition-all ease-in-out"
                style={{
                  opacity:          featureVisible && ready ? 1 : 0,
                  transform:        featureVisible && ready ? "translateY(0)" : "translateY(8px)",
                  transitionDuration: "450ms",
                  transitionDelay:  ready && featureVisible ? "0ms" : "0ms",
                }}
              >
                <h3 className="font-display font-semibold text-xl text-text-primary mb-2">
                  {signupHighlights[featureIndex].title}
                </h3>
                <p className="font-display italic text-base text-text-secondary leading-relaxed max-w-sm">
                  {signupHighlights[featureIndex].description}
                </p>

                {/* dot indicators */}
                <div className="flex gap-2 mt-6">
                  {signupHighlights.map((_, i) => (
                    <span
                      key={i}
                      className="block h-1 rounded-full transition-all duration-500"
                      style={{
                        width:           i === featureIndex ? "20px" : "6px",
                        backgroundColor: i === featureIndex ? "var(--accent)" : "var(--border)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
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
