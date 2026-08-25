# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- Install deps: `pnpm install` — pnpm is the pinned package manager (`packageManager` in `package.json`); ignore `package-lock.json`, `pnpm-lock.yaml` is the one that's kept current.
- Dev server: `pnpm dev` — Next 16 uses Turbopack by default, serves at http://localhost:3000.
- Build: `pnpm build`
- Start production server (after build): `pnpm start`
- Lint: `pnpm lint` — runs the ESLint CLI directly against `eslint.config.mjs` (flat config); `next lint` no longer exists in Next 16.
- No test framework is configured in this repo.

## Architecture

### This is Next.js 16 (App Router) — not the Next.js in your training data
Key breaking changes from Next 14/15 that show up in this codebase:
- `middleware.ts` is renamed `proxy.ts`. Route protection lives in `src/proxy.ts`, exporting a `proxy` function (not `middleware`).
- `cookies()`, `headers()`, `params`, and `searchParams` are async-only — no sync fallback.
- Turbopack is on by default for both `dev` and `build`; the `turbopack` option in `next.config.ts` is top-level, not under `experimental`.
- `revalidateTag` now requires a `cacheLife` profile as a second argument.

Full docs are vendored at `node_modules/next/dist/docs/` (after `pnpm install`) — read the relevant page there before relying on API shapes from training data.

### Route groups map to access levels
`src/app/` splits into four route groups, each gated differently:
- `(website)` — public storefront (home page, sofas, dining, bedroom, living-room, showroom, inspiration, cart, checkout, etc.)
- `(auth)` — `/login`, `/register`, `/admin/login` — unauthenticated
- `(admin)` — `/admin/*`, gated by `src/proxy.ts` checking the NextAuth JWT `role === "admin"`
- `(customer)` — `/customer/*`, gated by `src/proxy.ts` requiring any authenticated session
- `(customizer)` — `/customize-your-sofa`, the 3D sofa builder (`src/components/sofa/*`, built on `three`)

Auth is NextAuth (`src/app/api/auth/[...nextauth]/route.ts`), JWT sessions carrying `role` and `accessToken`. `src/proxy.ts` is the single source of truth for which paths require which role — check it before adding new protected routes.

### Backend is a separate Laravel API
This app is a UI-only Next.js frontend; persistent data comes from a Laravel API at `NEXT_PUBLIC_API_URL` (`src/lib/api.ts`, defaults to `http://127.0.0.1:8000` in dev / `https://api.shanyliving.com` in prod).
- `src/lib/api.ts` exports a preconfigured `axios` instance (`api`) for use outside React; it attaches the bearer token from `localStorage` on the client.
- `src/lib/api-client.ts` exports `apiFetch`, a `fetch`-based helper for Server Components/Actions and the `useApi()` hook (`src/hooks/use-api.ts`), which sources the bearer token from the NextAuth session instead of `localStorage`.
- Domain-specific fetchers live in `src/lib/*.ts` (`catalog.ts`, `storefront-catalog.ts`, `admin-data.ts`, `customer-panel.ts`, `journey.ts`, `mailbox.ts`, `media.ts`, `mobile-catalog.ts`, `storefront-pages.ts`) — check here for existing data-fetching logic before adding new API calls.
- Realtime updates (notifications, mailbox) go over Pusher/Laravel Echo (`laravel-echo` + `pusher-js`), pointed at a Laravel Reverb server via `NEXT_PUBLIC_REVERB_*` env vars.

### Mailbox talks IMAP/SMTP directly
`src/app/api/mailbox/*` route handlers use `imapflow`/`mailparser` and `nodemailer` server-side to read and send mail directly, configured via `MAIL_IMAP_*`/`MAIL_SMTP_*` env vars — this is the one feature the Next app owns end-to-end rather than proxying through Laravel.

### State
- Server/remote state: TanStack Query, provider wired once in `src/components/app/AppProviders.tsx` (also holds `SessionProvider`, theme bridge, cart drawer, toaster).
- Client-only state: Zustand stores in `src/stores/` — `admin-crud-store.ts` (admin table UI state) and `customer-commerce-store.ts` (cart/theme), persisted to `localStorage`.
- i18n: `next-intl`, but locale is **not** in the URL — it's cookie-based (`NEXT_LOCALE`, see `src/i18n/`). Default locale is `he` (Hebrew, RTL); supported locales `he`/`en`/`fr`/`it` (`src/i18n/config.ts`), translations in `messages/*.json`.

### UI components
shadcn/ui (`components.json`, style `base-nova`) generates into `src/components/ui/`; feature components are organized by domain under `src/components/{admin,auth,customer,landing,layout,sofa,storefront,icons}/`. Path alias `@/*` resolves to `src/*`.

### Third-party embed
`src/app/layout.tsx` loads a ShiputzAI storefront script (`shipazti.com/embed/...`). Product pages expose data hooks it depends on — check for `ShiputzAI`/`shiputzai` usage before changing product page markup or removing what look like unused props/attributes.
