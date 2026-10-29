# Dr Attiya Ortho — project instructions for Claude

Clinician-led Google Ads landing page for Dr Attiya Ahmed (Dentist, GDC 245279) at NuDental / Nu Dentalign, Baildon. Live at **https://drattiyaortho.co.uk/clear-aligners**. Owner: LeadEase (info@leadease.co.uk), working for NuDental.

Read these before changing anything:
- `CLAUDE-MASTER-PROMPT.md` — the commercial, creative and compliance brief. **It is the controlling brief.**
- `docs/HANDOFF.md` — what has been done, decisions taken, open items and the Google Ads plan.
- `CLAUDE-TECHNICAL-HANDOVER.md` is the original ChatGPT/Codex handover and is **out of date** on hosting (the site no longer runs on ChatGPT Sites). Use this file and `docs/HANDOFF.md` instead.

## How the site is built and deployed

- Stack: React 19 / Next.js-style app router built with **vinext + Vite**, running as a **Cloudflare Worker** (`worker/index.ts`).
- `main` on GitHub (`LeadEase/dr-attiya-ortho`) **auto-deploys** to Cloudflare Workers Builds (account info@leadease.co.uk, Worker `dr-attiya-ortho`). Every push to `main` is live in ~3 minutes. Test before pushing.
- Cloudflare build settings: build `pnpm build`, deploy `npx wrangler deploy --config dist/server/wrangler.json`.
- Local: `pnpm install --frozen-lockfile`, `pnpm dev`, `pnpm build` (Node ≥ 22.13, pnpm 11).
- Worker name and **non-secret** settings live in `vite.config.ts` (`localBindingConfig.vars`) so deploys don't wipe them. `keep_vars: true` is set.
- The only secret is `RESEND_API_KEY`, stored as a Cloudflare **Secret**. Never put it in code, chat or commits.
- `GET /api/enquiry` returns which email settings are present (true/false only) — use it to check the form is configured.

## Key files

- `app/clear-aligners/landing.tsx` — the whole landing page (client component): sections, two-step form, carousels, finance calculator, cookie banner, GTM loader, JSON-LD.
- `app/clear-aligners/page.tsx` — route wrapper + canonical.
- `app/layout.tsx` — metadata, icons. `app/globals.css` — all styling.
- `worker/index.ts` — `/` → 302 to `/clear-aligners` (keeps query string), `/api/enquiry`, security + cache headers.
- `lib/lead-delivery.ts` — validation + Resend email to enquiries@nudental.co.uk.
- `public/images/*.webp` — optimised images. Originals are NOT in git (kept on the owner's Mac in `asset-originals`).

## Rules (from the brief — do not break)

- Do **not** change the finance section or calculator unless the owner asks (owner instruction, Oct 2026).
- Two-step form stays on the same page: Step 1 name/phone/email (never sent to the server), Step 2 Yes/No price awareness → `/api/enquiry`. Accept both answers.
- The main conversion `enquiry_accepted` fires **only** after Resend accepts the email. Never fire it on Step 1. Never put name/phone/email in analytics or the dataLayer.
- Tracking loads only after cookie consent (Consent Mode v2 is sent). GTM container: `GTM-PSXRJKVZ`.
- No specialist claims for Dr Attiya, no invented reviews/cases/savings, no retouched or synthetic clinical images, no "Invisalign" as the product name, £1,999 applies to clear aligners only, X-rays only when clinically indicated, simulations are illustrative.
- British English, plain patient-friendly wording.
- Keep images as WebP sized for display; keep videos web-compressed (H.264, faststart, ≤ ~1 Mbps). Use new filenames when replacing media (30-day cache on `/images` and `/videos`).

## Known technical debt

- `package.json` still lists ~20 unused packages so the committed `pnpm-lock.yaml` stays valid. With network access: remove them, run `pnpm install`, commit both files, confirm the Cloudflare build passes.
- `scripts/` and `vite.config.ts` still contain ChatGPT Sites tooling (`sites-vite-plugin`, execution profile). Harmless; can be removed later with care.
