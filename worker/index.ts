import handler from "vinext/server/fetch-handler";
import { deliverLead, parseLead } from "../lib/lead-delivery";

const submissions = new Map<string, number[]>();
const duplicates = new Map<string, number>();

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "x-frame-options": "DENY",
    },
  });
}

async function handleEnquiry(request: Request, env: Cloudflare.Env) {
  // Setup check: shows WHICH settings are present (yes/no only, never their values).
  if (request.method === "GET") {
    const settings = { RESEND_API_KEY: !!env.RESEND_API_KEY, ENQUIRIES_TO_EMAIL: !!env.ENQUIRIES_TO_EMAIL, ENQUIRIES_FROM_EMAIL: !!env.ENQUIRIES_FROM_EMAIL };
    return json({ ready: Object.values(settings).every(Boolean), settings });
  }
  if (request.method !== "POST") return json({ message: "Method not allowed." }, 405);
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && !["same-origin", "same-site", "none"].includes(fetchSite)) return json({ message: "Request not allowed." }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return json({ message: "Content type must be application/json." }, 415);
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 16_000) return json({ message: "Enquiry is too large." }, 413);

  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const now = Date.now();
  const recent = (submissions.get(ip) ?? []).filter((timestamp) => now - timestamp < 10 * 60_000);
  if (recent.length >= 5) return json({ message: "Too many attempts. Please wait a few minutes and try again." }, 429);
  submissions.set(ip, [...recent, now]);

  let input: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 16_000) return json({ message: "Enquiry is too large." }, 413);
    input = JSON.parse(raw);
  } catch { return json({ message: "Invalid enquiry." }, 400); }
  const { lead, error } = parseLead(input);
  if (!lead) return json({ message: error ?? "Invalid enquiry." }, 400);
  if (lead.website) return json({ accepted: true });

  const previous = duplicates.get(lead.idempotencyKey);
  if (previous && now - previous < 24 * 60 * 60_000) return json({ accepted: true, duplicate: true });

  try {
    // One automatic retry covers brief email-provider hiccups.
    try { await deliverLead(lead, env); } catch (first) {
      if (first instanceof Error && first.message.startsWith("Enquiry delivery is awaiting")) throw first;
      await new Promise((resolve) => setTimeout(resolve, 800));
      await deliverLead(lead, env);
    }
    duplicates.set(lead.idempotencyKey, now);
    return json({ accepted: true });
  } catch (error) {
    console.error("Lead delivery failed", error instanceof Error ? error.message : error);
    // Never show internal configuration/provider messages to patients.
    const phone = env.NEXT_PUBLIC_TRACKING_PHONE_DISPLAY || "01274 003456";
    return json({ message: `Sorry, we couldn’t send your enquiry just now. Please try again in a moment or call NuDental on ${phone}.` }, 503);
  }
}

const worker = {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    if (url.pathname === "/api/enquiry") return handleEnquiry(request, env);
    const response = await handler.fetch(request, env, ctx);
    const headers = new Headers(response.headers);
    headers.set("x-content-type-options", "nosniff");
    headers.set("referrer-policy", "strict-origin-when-cross-origin");
    headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");
    headers.set("x-frame-options", "DENY");
    // Images and videos never change name without changing content, so let browsers and the CDN keep them.
    if (/^\/(images|videos)\//.test(url.pathname) && response.ok) headers.set("cache-control", "public, max-age=2592000");
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
};

export default worker;
