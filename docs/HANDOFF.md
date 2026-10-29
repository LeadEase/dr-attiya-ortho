# Handoff — Dr Attiya Ortho landing page

Last updated: 29 October 2026. Written at the end of the setup session in Claude (claude.ai) so work can continue in Claude Code.

## Where things stand

The clear-aligner landing page is **live and taking enquiries** at https://drattiyaortho.co.uk/clear-aligners. A test enquiry was received at enquiries@nudental.co.uk. The bare domain forwards there (302, query string kept so `gclid`/`utm_*` survive).

| Piece | Status | Where |
| --- | --- | --- |
| Code | `main` branch, auto-deploys | GitHub `LeadEase/dr-attiya-ortho` |
| Hosting | Cloudflare Worker `dr-attiya-ortho` | Cloudflare (info@leadease.co.uk) |
| Domain DNS | On Cloudflare (nameservers moved from GoDaddy; domain still registered at GoDaddy) | Cloudflare → drattiyaortho.co.uk |
| Enquiry email | Working — Resend, domain drattiyaortho.co.uk verified, sender `enquiries@drattiyaortho.co.uk` | Resend (team "nudental"); key = Cloudflare Secret `RESEND_API_KEY` |
| Tag Manager | Container `GTM-PSXRJKVZ` (NU Dental account). GA4 Google tag + Conversion Linker + `enquiry_accepted` trigger + `enquiry_id` variable created; published | tagmanager.google.com |
| GA4 | New property "Dr Attiya Ortho" (separate from NuDental's existing property) | analytics.google.com |
| Google Ads conversion | **Not created yet** (Tag 3) | see Open items |
| Owner's step-by-step launch guide | Claude doc "Dr Attiya Ortho – Launch Steps" | https://claude.ai/artifact/A6VZtoX9EP9NqUiaBnuNhs |

## What was changed from the ChatGPT/Codex version (git log has detail)

- Images converted to sized WebP (4.6 MB → 0.6 MB); testimonial videos re-encoded (Aamina/Sara now 960px HD from the original files, Kasia 1.1 MB). Originals kept off-git on the owner's Mac.
- Removed unused template code (shadcn components, DB/drizzle, ChatGPT auth and connector code) and ~100 dead CSS rules.
- Header menu removed; header shows NuDental mark + phone + CTA. Phone link beside first form. "4.9 Google rating" in hero trust row. Eyebrow "Clear aligners · Bradford & Baildon".
- Mobile: Dr Attiya photo shown first and compact; smaller cookie banner.
- FAQs cut 17 → 8. "What makes Dr Attiya's approach different?" section removed (duplicated assessment + package).
- NuDental mark used for favicon (ico/PNG/SVG/apple-touch) and header.
- Form: Step-1 phone validation; friendly send-failure message with tap-to-call; server retries Resend once; stable enquiry id used as Google Ads transaction ID; Consent Mode v2; emails show patient name + "explain pricing" flag for "No" answers + UK time.
- Page moved to `/clear-aligners` (root forwards) so `/braces` can be added later on the same domain.

## Open items

**Owner / practice to confirm (do not change copy until confirmed):**
- Finance: FAQ says "0% finance for up to one year", calculator shows 0% for 9 months and 9.9% APR at 12 months; calculator monthly figures don't match a standard APR calculation. Get lender-approved figures. *Owner asked that the finance section and calculator stay as they are until then.*
- Claims: "4.9★ from 500+ Google reviews", "1,000+ orthodontic cases" (attributed to the NuDental team), whitening "normally £315", retainer "normally £400".
- Sender address assumption: `enquiries@drattiyaortho.co.uk` (owner hasn't objected).

**Google Ads (before spending on the new page):**
1. Create conversion action "Enquiry accepted" (Website → manual → *Use Google Tag Manager*), category Submit lead form, count One, set **Secondary** so existing campaigns don't start optimising to it.
2. In GTM add tag *Google Ads Conversion Tracking* with that ID + label, Transaction ID `{{enquiry_id}}`, trigger *Enquiry accepted*. Publish.
3. In the new aligner campaign use **campaign-specific goals** → Enquiry accepted.

**Later:** braces landing page at `/braces` (needs braces "from" price, metal/ceramic, braces cases with consent, braces reviews). Add a `service` field to the enquiry payload/email when it exists. Regenerate lockfile (see CLAUDE.md).

## Google Ads plan agreed with the owner

- **Stay in the existing NuDental Google Ads account** — no second account (Unfair Advantage / double-serving risk; new accounts start with no history). LeadEase can use a Manager (MCC) account for access.
- Separate tracking already exists (new GTM container + new GA4 property).
- **Keyword ownership** so campaigns don't overlap:
  - Aligner campaign → /clear-aligners: clear aligners, aligner cost, Invisalign Bradford, invisible braces, teeth straightening.
  - Braces campaign → /braces (later): braces, fixed/metal/ceramic braces, train tracks. Negatives: aligner(s), invisalign, invisible, clear.
  - Aligner campaign negatives: metal braces, fixed braces, ceramic braces, train tracks.
  - Existing NuDental campaigns: move or negative the aligner keywords so the new campaign owns them.
- Test new page vs nudental.co.uk with **Google Ads Experiments** (50/50 final URL), 4–6 weeks, judged on booked/attended assessments.
- Launch aligners first: Search only, ~10–15 miles around BD17 6AB, Maximise conversions (no target) → add tCPA after ~15–30 real enquiries; avoid >20% budget changes (resets learning). Braces about week 5.

## Existing campaign — ad group report, 1–28 Oct 2026 (owner supplied)

One campaign mixing braces and aligner ad groups, target CPA £29. Total £1,866.57 spend, 361 clicks, 52.0 conversions, **£35.90 per conversion**, 14.4% conversion rate. Conversions are whatever that account currently counts (NuDental website goals), fractional = data-driven attribution.

| Ad group | Cost | Clicks | Conv. | Cost/conv. | Conv. rate |
| --- | --- | --- | --- | --- | --- |
| Clear Aligners | £128.20 | 36 | 6.00 | **£21.37** | 16.7% |
| Invisible Braces | £105.06 | 18 | 4.50 | **£23.35** | 25.0% |
| Dental Braces | £305.33 | 79 | 10.00 | £30.54 | 12.7% |
| Invisalign | £526.22 | 91 | 16.83 | £31.26 | 18.5% |
| Invisalign Locations | £55.08 | 12 | 1.67 | £33.05 | 13.9% |
| Orthodontist | £573.24 | 88 | 10.50 | £54.62 | 11.9% |
| Teeth Straightening | £146.21 | 28 | 2.50 | £58.49 | 8.9% |
| Lingual Braces | £26.43 | 8 | 0 | — | 0% |
| Adult Braces | £0.79 | 1 | 0 | — | 0% |
| Orthodontic Braces | paused | | | | |

Read-outs (not yet acted on — the owner interrupted to request this handoff):
- Aligner-intent groups (Clear Aligners, Invisible Braces) are cheapest per conversion — good candidates to move to the new /clear-aligners page.
- **Orthodontist** is the largest spend at about double the target CPA; Teeth Straightening likewise. Check search terms before moving them.
- Braces and aligner groups share one campaign today — the keyword-ownership split above applies here.
- 28 days of data and small numbers per group: treat as directional.
