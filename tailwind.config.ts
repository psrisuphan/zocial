import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", ".light"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Noto Sans'", "'Noto Sans Thai'", "sans-serif"],
        mono: ["'Noto Sans Mono'", "monospace"],
        display: ["'Playfair Display'", "Georgia", "serif"],
      },
      colors: {
        bg: {
          primary:   "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary:  "var(--bg-tertiary)",
          surface:   "var(--bg-surface)",
          hover:     "var(--bg-hover)",
        },
        text: {
          primary:   "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted:     "var(--text-muted)",
          link:      "var(--text-link)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover:   "var(--accent-hover)",
          active:  "var(--accent-active)",
          subtle:  "var(--accent-subtle)",
        },
        border: {
          DEFAULT: "var(--border)",
          subtle:  "var(--border-subtle)",
        },
        status: {
          error:   "var(--color-error)",
          success: "var(--color-success)",
          warning: "var(--color-warning)",
        },
      },
      animation: {
        blink:          "blink 1s step-end infinite",
        "fade-in":      "fadeIn 0.5s ease both",
        "fade-in-up":   "fadeInUp 0.5s ease both",
        "slide-in-left":"slideInLeft 0.4s ease both",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          from: { opacity: "0", transform: "translateX(-10px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      fontSize: {
        xs:   ["11px", { lineHeight: "1.4" }],
        sm:   ["13px", { lineHeight: "1.4" }],
        base: ["15px", { lineHeight: "1.5" }],
        lg:   ["17px", { lineHeight: "1.5" }],
        xl:   ["20px", { lineHeight: "1.4" }],
        "2xl": ["24px", { lineHeight: "1.3" }],
      },
    },
  },
  plugins: [],
};

export default config;
