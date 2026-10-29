> **Out of date (29 Oct 2026):** the site now runs on Cloudflare Workers from GitHub, not ChatGPT Sites. See CLAUDE.md and docs/HANDOFF.md.

# Claude technical handover — Dr Attiya Ortho

## Start here

This archive contains the editable application source, not merely a screenshot or flattened HTML export. It includes the frontend, image/video assets and server-side enquiry handler.

The project contains no live API keys or passwords. Do not ask the owner to paste secrets into prompts or commit them to source control.

## Main files

- `CLAUDE-MASTER-PROMPT.md` — controlling commercial, creative and patient-experience brief.
- `app/page.tsx` — landing-page content, components, two-step form, testimonials, carousels, finance calculator, map, event tracking and structured data.
- `app/globals.css` — complete responsive design system and page styling.
- `app/layout.tsx` — page metadata and social sharing information.
- `app/robots.ts` and `app/sitemap.ts` — crawl configuration.
- `worker/index.ts` — Cloudflare Worker entrypoint and `/api/enquiry` request handling.
- `lib/lead-delivery.ts` — validation and Resend email delivery.
- `public/images/` — clinician, practice, transformation and treatment imagery.
- `public/videos/` — Aamina, Sara and Kasia patient testimonial videos.
- `.env.example` — required runtime variable names with no secrets.
- `.openai/hosting.json` — current managed Sites project identity and build configuration.
- `package.json` and `pnpm-lock.yaml` — dependencies and scripts.

## Runtime requirements

- Node.js 22.13 or later.
- pnpm 11.x is preferred because the lockfile is committed.

Typical local workflow:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Production build:

```bash
pnpm build
```

Do not commit `node_modules`, `dist`, `.next`, `.vinext`, `.wrangler`, local environment files or API keys.

## Environment variables

The frontend and server expect:

```text
RESEND_API_KEY=
ENQUIRIES_TO_EMAIL=enquiries@nudental.co.uk
ENQUIRIES_FROM_EMAIL=Dr Attiya Ortho <approved-sender@verified-domain>
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_TRACKING_PHONE_DISPLAY=01274 003456
NEXT_PUBLIC_TRACKING_PHONE_E164=+441274003456
```

`RESEND_API_KEY` must be stored as a platform secret. The From address must use a domain that has been authenticated with the transactional email provider.

The current managed hosting environment already has the recipient, sender label and phone values configured, but the production email-provider secret still requires secure installation and an end-to-end test.

## Form behaviour

Step 1 stays entirely in the browser and collects full name, phone number and email. It does not call the backend.

Step 2 shows the £1,999 starting price, asks Yes/No price awareness and submits the final payload to `/api/enquiry`.

The worker:

- accepts same-site JSON POST requests only;
- limits request size;
- validates name, phone, email, price awareness and idempotency key;
- uses a hidden honeypot field;
- applies simple in-memory rate and duplicate controls;
- sends the completed enquiry through Resend;
- returns success only after the provider accepts the email request.

The current in-memory rate and duplicate maps are per Worker isolate. For materially higher traffic, replace them with durable Cloudflare storage and consider Turnstile while preserving the short patient journey.

## Deployment and access

Current managed Sites project ID:

```text
appgprj_6ae0b27d46dc81918b1624d8cd5928a5
```

Current public preview:

```text
https://dr-attiya-ortho-preview.docilevole68.chatgpt.site/
```

Target production domain:

```text
https://drattiyaortho.co.uk/
```

Possession of this archive does not automatically grant deployment rights to the existing managed Sites project. To continue using that hosting project, the owner must grant appropriate platform/editor access or perform deployments from the existing authorised workspace. Alternatively, the source can be migrated to a compatible Cloudflare/Vercel-style deployment after adapting the Worker/runtime configuration.

GoDaddy access should be granted using delegated access rather than sharing the account password. Only the exact A/CNAME and validation records returned by the chosen hosting platform should be entered.

## Remaining launch dependencies

1. Authenticate the final email-sending domain.
2. Add `RESEND_API_KEY` securely.
3. Send a controlled test enquiry and confirm receipt at `enquiries@nudental.co.uk`.
4. Add approved GTM/GA4/Google Ads identifiers and test the `enquiry_accepted` conversion.
5. Connect `drattiyaortho.co.uk` and optional `www` redirect.
6. Confirm SSL and canonical behaviour on the custom domain.
7. Test Safari, Chrome and a real mobile device after the final domain and third-party scripts are active.
8. Confirm finance terms, value comparisons and the attribution of the 1,000+ cases claim in writing.
9. Keep an internal record of patient image and testimonial permissions.

## Important implementation cautions

- Do not replace real clinical cases with generated imagery.
- Do not alter tooth positions in patient photos.
- Do not put the finance calculator inside the enquiry form.
- Do not send Step 1 contact details to the server.
- Do not fire the main lead conversion on Step 1 or on a submit attempt.
- Do not put contact details into analytics events.
- Do not change the site to a multi-page practice website.
- Do not expose secrets in the client bundle.
- Do not delete the current assets until replacements are approved and checked in context.

