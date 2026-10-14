# AGENTS.md — Gorkhali Gym CMS/Design Audit

## Status (Oct 14 2026)
Branch: experiment/athletic-kinetic-design @ 65f590a
Server: next dev (or next start on :3000). Logs in /tmp/opencode/start*.log
Tests/DevTools: Chrome DevTools MCP works; Playwright MCP unavailable (chrome missing). rg not installed (use Grep or node).
Read-only CMS→Prisma/Postgres migration audit completed (see Architecture Audit).

## CMS Fix — Auth + Durable Persistence (Oct 14 2026)
Root cause of the "empty CMS / can't save / can't upload" bug: Next.js App Router
compiles each route handler as a separate module graph, so module-level singletons
were NOT shared. `lib/auth.ts` held an in-memory `sessions` Map (login succeeded but
every authenticated request 401'd) and `lib/data-store.ts` created `new DataStore()`
per route (dashboard/list reads and saves used divergent copies). The admin client
also swallowed 401s (no `res.ok` checks), so failures looked like "empty content".

Fixes:
- `lib/auth.ts`: replaced stateful session Map with **stateless HMAC-signed tokens**
  (`payload.signature`, `timingSafeEqual`, 7-day expiry). Admin list moved to
  `globalThis.__gorkhaliAdmins`. Secret from `ADMIN_SESSION_SECRET` (dev fallback).
  API surface unchanged (`requireAuth`, `verifyCurrentSession`, `revokeCurrentSession`,
  `changeAdminPassword`, `createAdminUser`, `listAdminUsers`).
- `lib/data-store.ts`: `store` is now a `globalThis.__gorkhaliStore` singleton; added
  `snapshot()` / `hydrate()`.
- `app/gorkhali-gym-management/page.tsx`: `fetchAllCmsData` now checks `res.ok` and
  surfaces failures (console + toast) instead of silently ignoring them.

Durable persistence (serverless/Vercel):
- Neon project provisioned: **`gorkhali-gym` = `cold-cell-96302372`**, org
  `org-calm-mode-62612173` (Keshav), region `aws-ap-southeast-1`. The Vercel-managed
  org blocks CLI project creation. Real pooled `DATABASE_URL` + direct `DIRECT_URL`
  live in gitignored `.env`.
- New `lib/store-persistence.ts`: persists the whole CMS state as one JSONB row in
  table `"CmsSnapshot"` (id `singleton`, auto-created via `CREATE TABLE IF NOT EXISTS`).
  `hydrateStore()` loads it once per process; `persistStore()` upserts (queued).
  Graceful in-memory fallback when `!isDbConfigured`.
- New root `instrumentation.ts`: calls `hydrateStore()` on server start (Node runtime).
- Write-through: `await persistStore()` added after every store mutation in the 20
  mutation route handlers under `app/api/cms/**`, `app/api/inquiries`,
  `app/api/reviews/submit`, `app/api/upload{, -local}`.
- `next.config.ts`: `serverExternalPackages: ['@prisma/client', 'prisma']` so the
  Prisma engine loads from node_modules on Vercel (confirmed in `.nft.json` traces).
- Public reads stay publish-filtered (`getX(!adminMode)`); `?all=true` still auth-gated.

Vercel env vars still required for production: `DATABASE_URL`, `DIRECT_URL`,
`ADMIN_SESSION_SECRET`, `ADMIN_SEED_USERNAME`, `ADMIN_SEED_PASSWORD`,
`BLOB_READ_WRITE_TOKEN`.

Verified (live): login 200 → session `authenticated:true`, `dbConfigured:true`;
authenticated GETs 200 with data; save persists to DB (`CmsSnapshot` row updated);
delete persists; upload 200; **cold-start hydrate proven** (killed all servers, new
process loaded a previously-saved program from Neon); admin dashboard shows
"PostgreSQL Connected" and real counts; TRAINING PROGRAMS tab renders 4 items;
`tsc --noEmit` 0 errors; `eslint` clean on all changed files; `npm run build` success.
Known pre-existing: 14 `react-hooks/purity` lint errors in the admin page (inline
`Date.now()` in JSX), unrelated to these changes; build ignores eslint.

## Verification (Oct 14 2026 — CMS Improvements)
- `npx tsc --noEmit` → 0 errors. `next lint` → clean.
- `npm run build` → success (compiled, types valid, 48 pages).
- Credentials: login works via gitignored `credentials.md`; fails when neither file nor env vars present; `?all=true` still 401 unauthenticated.
- Footer: renders link columns + utility links from Navigation CMS (`location: 'footer'`).
- Subpage heroes: all 15 subpages render via `PageHero` from CMS `hero` sections; API `/api/cms/sections?page=` returns per-page data.
- Admin: sidebar replaced with `AkTabNav` (grouped, badged); Refresh/Logout use `AkButton`; Sections tab has page selector.
- `npm run build` clean; Chrome manual checks pass (footer CMS links, subpage heroes, admin sidebar).

## Completed
- Social Video Gallery: full implementation (FB share resolution, 9:16 embed, gallery + homepage, CMS tab), verified.
- Phase 1 (Security): gated ?all=true with requireAuth across CMS routes; navigation/sections public filtering; admin fetch uses ?all=true; removed prefilled login creds.
- Phase 2 (AK restyle + primitives): globals.css token added (--color-ak-accent-light); bulk AK restyle of admin page.tsx; ImagePickerField restyled; new primitives (AkButton, AkCard, Toast, ConfirmDialog, SectionHeader, Skeleton).
- Phase 3 (Functionality): draft tracking/auto-persist for gallery/videos, immediate publish toggles (validity-checked), error→toasts added to save handlers, adminUsersList table, loading UX (progress bar + skeleton), SectionHeader for Gallery/Videos. tsc --noEmit passes (0 errors). eslint: 0 new errors (pre-existing ImagePickerField effect lint in HEAD context; fixed that specific issue with setTimeout; prisma.ts unused-disable cleaned/fixable).
- Phase 4 partial: Footer "Programs & Training" now derived from CMS programs (fixes stale slugs); layout metadata wired to store settings.
- Phase 4 (header nav): Header desktop nav + mobile drawer now render dynamically from Navigation CMS (`/api/cms/navigation`), with dropdowns, two-column layout for >5 children, accent "→" all-links, and active-state highlighting (subpath + child match). Verified in Chrome (desktop dropdowns, mobile accordions, active state on /blog). tsc + eslint clean.
- Phase 4 (homepage copy + SEO): all homepage marketing section copy (programs/services/why/membership/trainers/gallery/videos/reviews/faq) now CMS-driven via `PageSectionItem` keys with fallbacks; homepage fetches `/api/cms/sections?page=home` to hydrate (fixes prior no-sync for hero/intro too). Seeded 9 new home sections in `initialSections`. Added `HealthClub` JSON-LD, `metadataBase`, canonical, OG/Twitter image in `app/layout.tsx`. New `lib/site-url.ts` (`getSiteUrl`) safely parses `APP_URL` (placeholder-safe) and is used by layout/sitemap/robots.
- Phase 4 (section rendering): `app/page.tsx` now renders homepage sections dynamically by iterating the ordered visible-section array (`displayOrder`) through a `renderSection` switch, so the previous `isVisible === false` guards (which never fired because the public `?page=` read excludes hidden sections) are gone. Section visibility toggles now hide sections on the homepage, section reordering (admin up/down) now takes effect, and unknown/custom keys render via new `components/GenericSection.tsx`. The seeded `cta` section now renders by default as a generic CTA band — hide it or change its `displayOrder` in the CMS to reposition it. gallery/videos now render as two separate sections.
- **CMS Improvements (Oct 14 2026 — Phase C/A1/A2/B):**
  - **Credentials → gitignored file:** Created `credentials.md` (gitignored), new `lib/admin-credentials.ts` loader with env-first → dev fs fallback, updated `lib/auth.ts` to read from loader (no hardcoded creds), added `ADMIN_SEED_USERNAME`/`ADMIN_SEED_PASSWORD` to `.env.example`. Verified: login works via credentials.md locally; fails when neither file nor env present; `?all=true` still 401 unauthenticated.
  - **Quick wins (A1):** Footer link columns + utility links now rendered from Navigation CMS (`location: 'footer'` + `footerColumn`); `Header`/`Footer` apply-button labels use `settings.applyButtonLabel`; `layout.tsx` favicon uses `settings.faviconUrl`; `apply/page.tsx` phone uses `settings.phone`. Navigation admin editor gains `location` (header/footer) + `footerColumn` controls.
  - **Subpage heroes (A2):** Added per-page `hero` sections to `initialSections` (about, services, training, membership, membership/club, membership/refer-a-friend, team, gallery, blog, faq, offers, events, reviews, contact, apply); created `components/PageHero.tsx` (client, fetches `/api/cms/sections?page=`); replaced 15 hardcoded hero blocks across subpages with `<PageHero pageSlug="..." fallback={{...}} />`. Admin Sections tab gained a page selector (`sectionPageFilter`) to manage sections per page.
  - **CMS UI primitives + consistency (B):** New primitives in `components/cms/`: AkField, AkInput, AkTextarea, AkSelect, AkToggle, AkPageHeader, AkTabNav, AkEmptyState, AkStatCard (plus existing AkButton, AkCard, Toast, ConfirmDialog, SectionHeader, Skeleton). Admin sidebar (260 lines) replaced with `AkTabNav` driven by `tabConfig` array (18 tabs with groups/badges). Header action buttons (Refresh, Logout) converted to `AkButton`. Admin Sections tab page selector implemented. tsc/lint/build all clean.

## Verification (Oct 14 2026)
- `npx tsc --noEmit` → 0 errors. `next lint` on changed files → clean.
- `npm run build` → success (compiled, types valid, 48 pages).
- Chrome: homepage renders all 10 CMS section headings; canonical/og:url/JSON-LD present; 0 console errors. Header desktop dropdown (Explore 8 links, 2-col) + mobile drawer accordions verified.
- API auth/public filtering: `?all=true` → 401 unauthenticated; public reads → 200; `?page=home` → 12 sections.

## Verification (CMS Improvements — Oct 14 2026)
- `npx tsc --noEmit` → 0 errors. `next lint` → clean.
- `npm run build` → success (compiled, types valid, 48 pages).
- Credentials: login works via gitignored `credentials.md`; fails when neither file nor env vars present; `?all=true` still 401 unauthenticated.
- Footer: renders link columns + utility links from Navigation CMS (`location: 'footer'`).
- Subpage heroes: all 15 subpages render via `PageHero` from CMS `hero` sections; API `/api/cms/sections?page=` returns per-page data.
- Admin: sidebar replaced with `AkTabNav` (grouped, badged); Refresh/Logout use `AkButton`; Sections tab has page selector.
- `npm run build` clean; Chrome manual checks pass (footer CMS links, subpage heroes, admin sidebar).

## Architecture Audit — CMS → Prisma/Postgres (Oct 14 2026, read-only)
- Branch `experiment/athletic-kinetic-design @ 65f590a`; 22 modified + 12 untracked paths preserved; no commits.
- Data layer: entire CMS is an in-memory singleton `lib/data-store.ts:993-1662` (`export const store`, line 1662). Prisma is imported (`line 1`) but never called; only `isPostgresConnected()` → `isDbConfigured` (`lib/prisma.ts:7-17`).
- Prisma: `prisma/schema.prisma` has 18 models but **no `migrations/`, no `prisma.config.ts`, no seed script, no db npm scripts, no postinstall**. Client is generated (rhel engine, Vercel-compatible). `DATABASE_URL`/`DIRECT_URL` are expected (`env()`), values not inspected; placeholder guard disables DB.
- Schema gaps: **no `SocialVideo` model**; `Review` missing `role/authorName/content/createdAt`; `Inquiry` missing `program`; `GalleryItem.createdAt` unused; `Admin`/`AdminSession` models exist but are **unused** (auth is hardcoded + in-memory in `lib/auth.ts:18-30`). `ADMIN_SETUP_SECRET` referenced nowhere.
- Rendering: all server pages read the store directly; **no `dynamic`/`revalidate`/`generateStaticParams`** anywhere. Homepage (`app/page.tsx`) only fetches `sections`+`social-videos`; programs/plans/trainers/reviews/offers/faqs/gallery come from the client-bundled store defaults (`:71-82`).
- Auth/API: all `/api/cms/**` + `/api/inquiries` mutations `requireAuth`-gated; public GETs publish-filtered. `/api/cms/settings` and `/api/cms/referrals` GETs are public.
- Uploads: `app/api/upload/route.ts` (Blob) has **no type/size validation**; `upload-local` allows SVG (`:22`) and writes to `public/uploads` (ephemeral on serverless). Media in-use guard covers only programs/trainers/gallery/blog (`data-store.ts:1581-1584`).
- No CI/CD workflows, no `vercel.json`. `next.config.ts`: `eslint.ignoreDuringBuilds`, `images.unoptimized`, `@prisma/client` aliased off client bundle.

## Next Steps (CMS → Prisma/Postgres migration)
Dependencies in order; first task = Phase 1.
1. Phase 0: snapshot in-memory content to reviewable JSON (no secrets). Acceptance: all collections captured.
2. Phase 1 (**first task**): complete schema (add `SocialVideo`; `Review.role/authorName/content/createdAt`; `Inquiry.program`), generate baseline migration via read-only `prisma migrate diff`. Acceptance: `prisma validate` passes; SQL reviewed; runs on a throwaway dev DB; tsc/build green.
3. Phase 2: async Prisma repository layer with in-memory fallback when `!isDbConfigured`. Depends on 1.
4. Phase 3: idempotent seed/import (upsert on natural keys). Depends on 1-2.
5. Phase 4: convert routes/pages/homepage to repository; add `dynamic`/`revalidate` so edits are live and unpublished never leaks. Depends on 2.
6. Phase 5: DB-backed auth (`Admin`/`AdminSession`), `ADMIN_SETUP_SECRET` bootstrap, remove hardcoded creds, add login throttling. Depends on 1-2.
7. Phase 6: upload hardening (type/size, neutralize SVG, expand media in-use checks).
8. Phase 7: reconciliation + 9:16 regression + tsc/lint/build.

Risks (ranked): (1) no persistent source of truth / serverless instances diverge; (2) schema never applied; (3) auth rebuild; (4) static freezing; (5) homepage client defaults; (6) no atomicity; then model/field gaps, upload/media.
Open items still unfixed: subpage SSR hydration; 9:16 regression.

## Conventions
- Current data layer is in-memory (single instance); migration to the existing Prisma schema + Postgres is planned (see Architecture Audit / Next Steps). Do not add new features that deepen in-memory coupling.
- Preserve branch; don't remove features; don't commit unless asked.
- Use requireAuth for admin-only surfaces; public reads filtered.
- Never run migrations/seeds or connect to production during audits (read-only unless explicitly asked).
- AK tokens: ak-ink/surface/surface-2/line/accent/accent-dark/accent-light/muted.
