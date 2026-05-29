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
