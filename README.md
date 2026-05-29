# Zocial

A privacy-first PWA chat app for Gen Z. End-to-end encrypted DMs, group chats with sub-channels, Locket-style photo sharing, and a clean, installable experience — no app store needed.

## Status

**Pre-implementation.** Design phase complete. Phase 0 (foundation) in progress.

See [`docs/design.md`](docs/design.md) for the full specification, data model, permission matrix, and phased build plan.

## Features (Planned)

- **Authentication**: Email/password signup with profile setup (`@username`, display name, avatar, bio)
- **Friends**: Search users, send/accept friend requests, manage a close-friends list
- **Direct Messages**: End-to-end encrypted (E2EE), text/links/images, edit with "edited" label, unsend (hard delete), read receipts
- **Group Chats**: Roles (creator/admin/member), invite via friend-pick or 24h share codes, sub-channels (public/private)
- **Photo Sharing**: Ephemeral 24h sharing to all friends or close friends, fixed-emoji reactions, messages-on-photo → DM integration
- **Push Notifications**: Events for DMs, group messages, friend requests, shared photos, reactions
- **PWA**: Installable to home screen (iOS/Android), offline caching, standalone display

## Tech Stack

- **Frontend**: Next.js (React) + TypeScript + Tailwind CSS
- **Backend**: Supabase (Postgres, Auth, Realtime, Storage)
- **Hosting**: Vercel (frontend), Supabase Cloud (backend)
- **Security**: E2EE for DMs (library TBD), server-side encryption for groups/photos, Web Push

## Project Structure

```
Zocial/
├── docs/          ← specification & design docs
├── src/
│   ├── app/       ← Next.js App Router pages/routes
│   ├── components/
│   │   ├── ui/    ← reusable UI primitives
│   │   └── features/ ← feature-specific components
│   ├── hooks/     ← custom React hooks
│   ├── lib/       ← integrations & utilities
│   └── types/     ← TypeScript interfaces
├── supabase/
│   └── migrations/ ← SQL migrations
└── public/        ← static assets & PWA icons
```

## Getting Started

_(Coming in Phase 0)_

## License

MIT — see [LICENSE](LICENSE) for details.
