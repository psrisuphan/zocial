# Zocial — Design Document

> **App name:** Zocial (Gen-Z social/chat app)
> **Status:** Design / pre-implementation
> **Last updated:** 2026-05-29

---

## 1. Overview & Goals

A privacy-conscious, installable chat application delivered as a **PWA** (no app store).
Core pillars:

1. **Accounts & profiles** — Instagram-style identity (`@username` mutable, internal UUID immutable).
2. **Friends** — search → request → accept → friends; close-friends sub-list.
3. **Direct messages (E2EE)** — text, links, images; edit (labeled "edited"); unsend (hard delete); read receipts.
4. **Group chats** — roles (creator / admin / member), invite by friend-pick or share code, member management, group name/image, and **sub-channels** (public/private) like Discord text channels.
5. **Photo sharing (Locket-style)** — share to all friends or close friends, ephemeral 24h, fixed-emoji reactions, and "message while viewing" that drops into the normal DM thread.
6. **Push notifications** for the events that matter.

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Frontend / PWA | **Next.js (React)** + service worker + Web App Manifest |
| Backend (DB, Auth, Realtime, Storage) | **Supabase** (Postgres + Row-Level Security) |
| Frontend hosting | **Vercel** |
| Backend hosting | **Supabase Cloud** (managed) |
| Push | **Web Push (VAPID)** |
| Scheduled jobs (photo expiry, share-code cleanup) | **Supabase pg_cron / scheduled Edge Functions** |
| E2EE crypto | **Vetted library** (e.g. libsignal / Web Crypto-based, _to be finalized in Phase 2_) — never hand-rolled |

---

## 3. Security Model

### 3.1 What is encrypted how

| Data | Protection |
|---|---|
| 1:1 DM message content & images | **End-to-end** — server only ever holds ciphertext |
| Group / sub-channel messages & images | **Server-side** — TLS in transit + encryption at rest (server can read) |
| Shared photos | **Server-side** — TLS + at rest |
| All metadata (who, when, read state) | Server-readable, protected by RLS |
| Passwords | Supabase Auth (hashed) |

### 3.2 E2EE for DMs (design intent)

- Each user has an **identity keypair**. Public keys live server-side (`user_keys`) so others can encrypt to them; **private keys live only on the device**.
- DM history is stored on the server as **ciphertext**, encrypted so both participants can decrypt. This lets a re-installed device restore history after recovery.
- **Single recovery code** (one per user, not per chat): a secret phrase the user saves. It derives a key that **wraps the user's private keys** (`key_backups`). On a new device, entering the recovery code unwraps the keys and restores all DMs.
- **Single active device** at a time (phone-first) — simplifies key sync; no multi-device key-sharing subsystem in v1.
- **Push limitation:** because the server can't read DM content, DM push notifications show a **generic preview** (e.g. "New message from @alice") unless we later add encrypted-payload decryption inside the service worker. Group/photo pushes _can_ show real previews.

### 3.3 Unsend = hard delete

"Unsend" permanently deletes the message row (and any encrypted media) from the database. No soft-delete, no tombstone shown to the recipient.

---

## 4. Data Model

> Column lists are the important fields, not exhaustive DDL. All tables get `created_at`; RLS enforces access.

### Identity & keys
- **`profiles`** — `id` (UUID, PK, = auth user id), `username` (unique, case-insensitive, **mutable**), `display_name`, `bio`, `avatar_url`, `updated_at`
- **`user_keys`** — `user_id`, `identity_public_key`, (pre-keys as needed) — public material for E2EE
- **`key_backups`** — `user_id`, `wrapped_private_keys`, `salt` — recovery-code-encrypted private keys

### Friends
- **`friend_requests`** — `id`, `sender_id`, `receiver_id`, `status` (pending/accepted/declined), `responded_at`
- **`friendships`** — `user_id_a`, `user_id_b` (canonical ordered pair), unique
- **`close_friends`** — `owner_id`, `friend_id` (owner's private close-friends list)
- **`contact_nicknames`** — `owner_id`, `friend_id`, `nickname` (nullable) — one-sided, private nickname (owner only knows; friend is unaware)

### Direct messages (E2EE)
- **`dm_conversations`** — `id`, `user_a`, `user_b` (one row per pair)
- **`dm_messages`** — `id`, `conversation_id`, `sender_id`, `ciphertext`, `content_type` (text/link/image), `edited_at` (nullable → drives "edited" label), media refs (encrypted)
- **`dm_read_state`** — `conversation_id`, `user_id`, `last_read_message_id` (Messenger-style pointer)

### Groups
- **`groups`** — `id`, `name`, `avatar_url`, `creator_id`, `share_code`, `share_code_expires_at`
- **`group_members`** — `group_id`, `user_id`, `role` (creator/admin/member), `joined_at`
- **`group_channels`** (sub-channels) — `id`, `group_id`, `name`, `visibility` (public/private), `created_by`, `owner_id`, `is_default`
- **`channel_members`** — `channel_id`, `user_id`, `added_by` (only used for **private** channels)
- **`group_messages`** — `id`, `channel_id`, `sender_id`, `content`, `content_type`, `edited_at`, media refs
- **`group_read_state`** — `channel_id`, `user_id`, `last_read_message_id`

### Photo sharing
- **`shared_photos`** — `id`, `owner_id`, `image_url`, `audience` (all_friends/close_friends), `expires_at` (= created + 24h), `deleted_at`
- **`photo_reactions`** — `photo_id`, `user_id`, `reaction` (enum), unique per user per photo
- A "message on photo" creates a **`dm_messages`** row carrying a `photo_ref` (id) so the DM shows the photo as quoted context. If the photo is live → tappable to open; if expired/deleted → degrades to a plain "replied to your photo" quote.

### Infra
- **`push_subscriptions`** — `user_id`, `endpoint`, `p256dh`, `auth`
- **`notifications`** (optional, in-app feed) — `id`, `user_id`, `type`, `payload`, `read_at`

---

## 5. Permission Matrix

### Group roles

| Action | Creator | Admin | Member |
|---|:--:|:--:|:--:|
| Send messages | ✅ | ✅ | ✅ |
| Configure group name / image | ✅ | ❌ | ❌ |
| Generate / regenerate share code | ✅ | ✅ | ❌ |
| Invite friends directly | ✅ | ✅ | ❌ |
| Remove a **member** | ✅ | ✅ | ❌ |
| Remove an **admin** | ✅ | ❌ | ❌ |
| Promote member → admin / demote admin | ✅ | ❌ | ❌ |
| Create sub-channels | ✅ | ✅ | ❌ |
| Edit/rename/delete **own** sub-channel | ✅ | ✅ | ❌ |
| Edit/rename/delete **another's** sub-channel | ✅ | ❌ | ❌ |
| Delete the whole group | ✅ | ❌ | ❌ |

Admins can do everything the creator can **except**: delete the group, change group name/image, and act on the creator or other admins.

### Sub-channels (public vs private)

- **Public:** every group member can see, read, and post.
- **Private:** only users explicitly **added by an admin/creator** can see/participate. No self-join, no join requests.
  - **Creator sees ALL channels**, including private ones created by admins.
  - An admin **cannot** see/enter another admin's private channel unless added to it.
- **Ownership transfer:** if an admin who owns a private sub-channel is demoted or removed from the group, **the sub-channel stays and ownership passes to the creator.**

### Share code
- Lifetime **24 hours**, regenerable by creator/admins. Entering a valid code joins the group's default channel as a `member`.

---

## 6. Feature Specs

### 6.1 Auth & profile
- **v1:** email + password (Supabase Auth). Email is *not* the primary identifier — the UUID is — so Google/phone/OAuth can be added later as config only.

**Three-part identity (Instagram model):**

| Field | Unique? | Mutable? | Purpose | Rules |
|---|:--:|:--:|---|---|
| `id` (UUID) | ✅ | ❌ never | Internal primary key; all relationships/FKs reference this | System-generated; invisible to users |
| `@username` (handle) | ✅ (case-insensitive) | ✅ user can change | The handle others **search by** and **add as friend**; appears as `@name` | Lowercase letters/numbers/underscore/period; length 3–30; uniqueness re-checked on change |
| `display_name` | ❌ not unique | ✅ user can change | The friendly name shown **prominently** in chats, profile, member lists | Free-form (spaces/emoji allowed); length up to ~50; **optional → falls back to `@username` if blank** |

- Changing `@username` or `display_name` **never breaks anything** — all data is keyed on the immutable UUID.
- **UI convention:** show `display_name` as the primary label with `@username` as the secondary/handle beneath or beside it (e.g. **Alice Wong** · @alice). Two different people may share a display name ("Alex"), but never a `@username`.
- Profile also has: `bio`, `avatar` (uploaded to Storage).

### 6.2 Friends
- Search users by `@username`.
- Send request → recipient **accepts/declines**. On accept, a `friendship` row is created.
- Manage a **close-friends** sub-list (private to the owner).
- Set a **private one-sided nickname** for any friend (e.g., "BFF Sarah" for `@sarah_2024`). The friend doesn't know they've been nicknamed. Visible only to the owner in friends list and chats.

### 6.3 DMs (E2EE)
- Content types: **text, links, images** (≤ **10 images/message**, EXIF/location stripped **client-side** before encryption+upload). No file attachments.
- **Edit:** allowed by sender; UI shows **"edited"**. No edit history kept.
- **Unsend:** hard delete; recipient sees nothing and gets no notice.
- **Read receipts:** last-read pointer per user.

### 6.4 Group chats
- Create group → default main sub-channel auto-created.
- Invite via friend-pick or share code; join by code.
- Roles & permissions per matrix above.
- Group name/image configurable by creator only.
- Sub-channels (public/private) as specified.
- Same message capabilities as DMs (text/link/image, edit, unsend) — **server-side encrypted**, so push previews can show content.
- **Group read receipts:** show 2–3 avatars + "+N"; tap to see the full "seen by" list.

### 6.5 Photo sharing (Locket-style)
- Capture/upload a photo → choose audience: **All friends** or **Close friends**.
- Photo is **ephemeral: auto-expires after 24h**; owner can delete earlier.
- Friends in the audience can **react** (fixed set: 😂 funny, 😭 cry, 🔥 fire, ❤️ heart, 😔 pensive, 😢 sad, 😊 smile) and/or **send a message while viewing**.
- A message-on-photo lands in the **normal DM thread** with the sharer, quoting the photo as context (tappable while live; degrades after expiry/deletion).
- Sharer is **notified of reactions** including who reacted and which reaction.

---

## 7. Realtime & Storage

- **Realtime:** Supabase Realtime subscriptions on message tables push new/edited/deleted rows to clients live (DMs, group channels, reactions, read state).
- **Storage:** Supabase Storage buckets for avatars, group images, message images, shared photos.
  - DM images: encrypted client-side (E2EE) before upload; thumbnails also generated client-side.
  - Group/photo images: encrypted at rest server-side; thumbnails can be generated server-side.
- **Scheduled jobs:** pg_cron/Edge Function deletes expired shared photos and stale share codes.

---

## 8. Push Notifications

- **Mechanism:** Web Push (VAPID), via the service worker.
- **Platform reality:** works on Android browser + installed PWA; on **iOS only after the PWA is installed to the home screen (iOS 16.4+)**.
- **Events:** new DM, new group message, friend request, friend shared a photo (text differs: "shared a photo" vs "shared a photo with close friends"), reaction to your photo.

### 8.1 DM preview strategy (the E2EE constraint)

Because DM content is E2EE, the **server holds only ciphertext** and cannot compose a content preview. The sender's `@username` is server-known metadata, so the sender can always be shown.

- **Group / photo / friend-request pushes:** show **real previews** (server-side encrypted, server-readable).
- **DM pushes — CHOSEN APPROACH (Option 1, locked):**
  - **Generic preview** — e.g. *"New message from @alice"*. Reliable on all platforms (Android + installed iOS PWA). The sender `@username` is shown (server-known metadata); message text is not.
  - **Privacy setting:** a user-facing **"show notifications from this chat" / preview on-off** toggle (default on). Consistent with Zocial's E2EE ethos.
  - **Service-worker-side decryption is NOT planned for v1.** It remains a possible future enhancement only; the v1 design does not depend on it.

---

## 9. PWA & Hosting

- **PWA:** Web App Manifest (name, icons, theme, display: standalone) + service worker (offline shell caching, push handling).
- **Frontend:** deployed on Vercel → public HTTPS URL, custom domain optional. Accessible to anyone, not just LAN.
- **Backend:** Supabase Cloud.
- **Design language:** clean, modern, compact, friendly, easy to use; **light/dark mode** toggle.

---

## 10. Phased Build Plan

Each phase lists its **Goal**, **What we build**, **How (key tasks)**, and **Acceptance criteria** (definition of done).

---

### Phase 0 — Foundation
**Goal:** A deployable, installable PWA with working auth and profiles, live on a public URL from day one.

**What we build:** Next.js PWA shell, manifest + service worker, Supabase project + base schema, theming, email/password auth, profile setup.

**How (key tasks):**
- Initialize Next.js (App Router) + TypeScript + Tailwind (chosen for compact, modern, themeable UI).
- Create Supabase project; add `profiles` table + RLS; DB trigger to create a profile row on signup.
- Add Web App Manifest (name "Zocial", icons, `display: standalone`, theme color) + service worker (offline shell caching).
- Build auth pages (sign up / log in / log out) with Supabase Auth; session handling.
- Build profile setup: unique `@username` (case-insensitive uniqueness check), display name, bio, avatar upload to Storage.
- Implement light/dark theme toggle (persisted).
- Deploy to Vercel; wire env vars to Supabase.

**Acceptance criteria:**
- [ ] Sign up with email/password; log in and out reliably.
- [ ] Set a unique `@username` (duplicates rejected), display name, avatar.
- [ ] App is **installable** to home screen on Android **and** iOS (manifest valid; "Add to Home Screen" launches standalone).
- [ ] Light/dark toggle works and persists across sessions.
- [ ] Reachable at a public HTTPS URL by anyone (not just LAN).

---

### Phase 1 — Friends
**Goal:** Users can find each other, form mutual friendships, and maintain a close-friends list.

**What we build:** user search, friend request/accept/decline, friends list, close-friends management.

**How (key tasks):**
- Add `friend_requests`, `friendships`, `close_friends`, `contact_nicknames` tables + RLS.
- Search by `@username` (indexed, case-insensitive).
- Request flow with statuses (pending/accepted/declined); realtime update on incoming requests.
- Friends list UI; close-friends add/remove toggle (private to owner).
- One-sided nickname UI: long-press or edit button on a friend to set/edit/clear a private nickname (e.g., "BFF Sarah" for `@sarah_2024`); displayed in friends list and DM threads only to the owner.

**Acceptance criteria:**
- [ ] Search returns users by `@username`.
- [ ] Send request → receiver sees it pending → accept creates a friendship; decline removes it.
- [ ] Non-friends cannot open a DM with each other.
- [ ] Add/remove a friend to/from close friends; list is visible only to its owner.
- [ ] Set/edit/clear a private nickname for a friend; friend doesn't know; nickname appears in your friends list and DM thread, but friend never sees it.

---

### Phase 2 — Direct Messages (E2EE)
**Goal:** Private, end-to-end encrypted 1:1 messaging with edit, unsend, read receipts, and recoverable history.

**What we build:** key generation, recovery-code backup/restore, encrypted messaging (text/link/image ≤10), edit, unsend (hard delete), read receipts, realtime.

**How (key tasks):**
- **Decision point:** choose the E2EE library/protocol (comparison delivered at phase kickoff — see Appendix A).
- Generate device identity keypair; publish public key to `user_keys`; store private key in IndexedDB.
- Recovery code: generate phrase → derive wrapping key → store wrapped private keys in `key_backups`; build new-device restore flow.
- Encrypt content client-side; store ciphertext in `dm_messages`; both participants decryptable.
- Images: strip EXIF/location + generate thumbnail **client-side**, encrypt, upload to Storage, store refs (≤10/message).
- Edit (re-encrypt, set `edited_at` → "edited" label, no history); unsend (hard-delete row + media).
- Read receipts via last-read pointer; Supabase Realtime subscriptions.

**Acceptance criteria:**
- [ ] Two users exchange messages; **DB inspection shows only ciphertext** (no readable content server-side).
- [ ] Edit shows "edited"; unsend removes the message with **no trace or notice** to the recipient.
- [ ] Read receipt updates correctly.
- [ ] Send up to 10 images per message; **EXIF/location verified stripped**.
- [ ] Links render as tappable links.
- [ ] New device + correct recovery code restores DM history; wrong code fails gracefully.

---

### Phase 3 — Group Chats
**Goal:** Multi-user group chats with roles, invites, and member management.

**What we build:** create group, roles (creator/admin/member), share code (24h, regenerable), friend-pick invite, join by code, member management, group name/image, default channel, messaging + group read receipts.

**How (key tasks):**
- Add `groups`, `group_members`, `group_channels` (default channel), `group_messages`, `group_read_state` + RLS.
- Enforce the §5 permission matrix server-side (RLS + checks).
- Share-code generation/expiry (24h)/regeneration; join-by-code flow.
- Group settings (name/image — creator only).
- "Seen by" UI: 2–3 avatars + "+N", tap for full list.

**Acceptance criteria:**
- [ ] Create group → default channel exists; creator role assigned.
- [ ] Invite a friend directly and via share code; code expires after 24h; regenerate works.
- [ ] Promote/demote admin; remove member; rules enforced (admin **cannot** remove creator/other admins, delete group, or change name/image).
- [ ] Group messages support text/link/image ≤10, edit, unsend.
- [ ] "Seen by" shows correctly with overflow and full-list view.

---

### Phase 4 — Sub-channels
**Goal:** Discord-style text channels within a group, public and private, with correct permissions and ownership rules.

**What we build:** create/rename/delete sub-channels, public/private visibility, private membership, ownership-transfer rule.

**How (key tasks):**
- Add `channel_members` (private channels) + visibility flag; RLS for who can see/post.
- Create permission (creator/admin); edit/delete own vs any (creator only for others'); private channels add-by-admin/creator only (no self-join); creator sees all channels; admins isolated from each other's private channels.
- Ownership transfer to creator when an owning admin is demoted/removed (DB trigger or app logic).

**Acceptance criteria:**
- [ ] Public channel: all group members see and post.
- [ ] Private channel: only added users see it; no self-join/requests; creator sees it even if admin-created; another admin can't see it unless added.
- [ ] Edit/rename/delete permissions enforced per matrix.
- [ ] Demoting/removing the owning admin → private channel persists and ownership passes to the creator.

---

### Phase 5 — Photo Sharing (Locket-style)
**Goal:** Ephemeral single-photo sharing to friends/close friends, with reactions and DM integration.

**What we build:** capture/upload single image, audience selection, 24h expiry + cleanup job, fixed-emoji reactions, message-on-photo → DM integration.

**How (key tasks):**
- Add `shared_photos`, `photo_reactions` + RLS (audience-based visibility).
- EXIF/location strip + thumbnail; server-side encryption at rest.
- 24h auto-expiry via pg_cron/Edge Function; owner manual delete (removes blob).
- Reactions (fixed set 😂😭🔥❤️😔😢😊) + notify sharer (who + which reaction).
- Message-on-photo creates a `dm_messages` row with `photo_ref`; tappable while photo is live; degrades to plain "replied to your photo" after expiry/deletion.

**Acceptance criteria:**
- [ ] Share to all friends vs close friends → only the correct audience sees it.
- [ ] Photo auto-disappears after 24h; owner can delete earlier; deletion removes the stored blob.
- [ ] React → sharer is notified with who + which reaction.
- [ ] Message while viewing → lands in the normal DM with a photo quote; tappable while live, degraded quote after expiry/deletion.
- [ ] EXIF/location verified stripped.

---

### Phase 6 — Push Notifications & Polish
**Goal:** Reliable notifications across platforms and production-ready polish.

**What we build:** Web Push subscriptions, event notifications, DM-preview strategy + privacy setting, performance, accessibility, final design polish.

**How (key tasks):**
- Add `push_subscriptions`; configure VAPID; service-worker push handler.
- Notify on: new DM, new group message, friend request, friend shared a photo (close-friends vs general wording), reaction to your photo.
- DM previews: generic by default (§8.1) + "show preview" privacy toggle; design hooks for the optional later SW-decryption enhancement.
- Performance pass, accessibility audit, responsive polish, finalized light/dark.

**Acceptance criteria:**
- [ ] Receive push for each event type on Android **and** installed iOS PWA.
- [ ] DM push shows sender + generic content (group/photo pushes show real previews); preview on/off toggle works.
- [ ] Lighthouse: installable PWA + acceptable performance/accessibility scores.

---

## 11. Confirmed Decisions

1. **App name:** Zocial. ✅
2. **Group message capabilities** mirror DMs exactly (text/link/image ≤10, edit, unsend, read receipts). ✅
3. **Image limits** (≤10/message, EXIF/location strip) apply to group messages too. ✅
4. **Shared photo = one image per share** (Locket-style single photo). ✅
5. **"Seen by"** available in DMs too (simpler since 1:1). ✅
6. **Out of scope for v1:** voice/video calls, file attachments, message search. ✅
7. **DM push previews:** generic by default + privacy toggle; SW-decryption is a post-v1 enhancement (§8.1). ✅
8. **E2EE library choice** is deferred to the **start of Phase 2**, where a full comparison (Appendix A) will be presented for selection. ✅

---

## Appendix A — E2EE Library/Protocol Candidates (to compare at Phase 2 kickoff)

A full comparison (maturity, browser/WASM support, group support, learning curve, maintenance) will be delivered at Phase 2 start. Candidate shortlist captured now:

- **libsignal (Signal Protocol)** — gold-standard X3DH + Double Ratchet; strong security; heavier integration; WASM/JS bindings to validate.
- **Matrix vodozemac / Olm** — Rust→WASM, well-maintained, designed for the web; pairs Double Ratchet primitives.
- **Web Crypto API + minimal custom protocol** — lightest dependency, full control, but more responsibility to get the protocol right (higher risk; only with careful review).
- **Managed E2EE SDK (e.g. Virgil E3Kit)** — fastest to integrate, handles key management; introduces a third-party dependency/service.

> Guiding principle: **never hand-roll core crypto primitives.** Favor a vetted, maintained option appropriate to a single-device, recovery-code-based 1:1 design.
