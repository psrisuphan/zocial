# Zocial — Build Progress

> Live "where did we leave off" tracker. Update this whenever a milestone changes.
> Full spec + phased plan lives in [`design.md`](./design.md) §10.

**Last updated:** 2026-05-30

---

## Current status: Phase 0 — Foundation (~90%, not yet formally signed off)

### ✅ Done & merged to `main`
- **PWA shell** — Next.js (App Router) + TypeScript + Tailwind. `public/manifest.json`, `public/sw.js`, `public/icons/` present. `vercel.json` configured.
- **Theming** — design tokens in `globals.css` (CSS-var light/dark), `tailwind.config.ts`. Accent = sage-mint green. Fonts: Noto Sans (UI) + Playfair Display (`font-display`, brand/editorial). Light/dark toggle persists via localStorage; no-flash inline script.
- **UI library** (`src/components/ui/`) — Button, Input, Textarea, Avatar, Card, PasswordInput, PasswordRequirements, Spinner, ThemeProvider, ThemeToggle, Toast (ToastProvider + useToast).
- **Auth** — Supabase (`@supabase/supabase-js`, client in `src/lib/supabase`). Flows: signup, login, logout, forgot-password, reset-password. Friendly error mapping in `src/lib/authErrors.ts`.
- **Profile setup** (`auth/setup-profile`) — unique case-insensitive `@username` check, display name, bio. (Currently writes `avatar_url: null`.)
- **Auth UI redesign** — split-screen `AuthShell` (`src/components/features/auth/AuthShell.tsx`):
  - Left brand panel = neutral `bg-secondary` + faint accent glows (deliberately NOT a colored background).
  - Login: "Zocial" typing animation + staggered feature list.
  - Signup: static "Join Us!" header + rotating Playfair feature cards (no emojis, friendly non-technical copy) with crossfade + dot indicators.
  - Animated gradient backgrounds; forms sit directly on background (no Card box, FB/X style).
  - Old welcome page `/` deleted → redirects: logged-in → `/dashboard`, logged-out → `/auth/login`.

### ⚠️ Pending — blocks formal Phase 0 sign-off
1. **Avatar upload** — `setup-profile` shows an "Add photo (soon)" placeholder; no Supabase Storage upload exists. Need: Storage bucket + upload widget + write real `avatar_url`. **Decision needed:** build now vs. formally defer.
2. **Live public HTTPS URL** — `vercel.json` exists but deployment is UNCONFIRMED. Verify it's deployed & reachable, or deploy.

---

## ▶️ Resume here next session
1. Resolve the two pending items above (avatar upload + deploy).
2. Tick the remaining boxes in [`design.md`](./design.md) §10 Phase 0 and add a "Phase 0 — Complete" note.
3. Start **Phase 1 — Friends** (see `design.md` §10): tables `friend_requests` / `friendships` / `close_friends` / `contact_nicknames` + RLS; `@username` search; request / accept / decline w/ realtime; friends list; close-friends toggle; one-sided private nicknames.

## Working agreements
- Feature-branch workflow; **never commit directly to `main`**. Merge only on explicit approval, then delete the branch.
- Atomic, conventional commits.
- Typography: Playfair Display for brand/editorial, Noto Sans for all UI.
- Auth brand panel: neutral background, accent only as small touches (wordmark, chips, glows) — not a full color fill.
