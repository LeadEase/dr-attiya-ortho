export type LeadPayload = {
  fullName: string;
  phone: string;
  email: string;
  priceAware: "Yes" | "No";
  submittedAt: string;
  landingUrl: string;
  idempotencyKey: string;
  website?: string;
  utm?: Record<string, string>;
};

type DeliveryEnvironment = {
  RESEND_API_KEY?: string;
  ENQUIRIES_TO_EMAIL?: string;
  ENQUIRIES_FROM_EMAIL?: string;
};

function clean(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

export function parseLead(input: unknown): { lead?: LeadPayload; error?: string } {
  if (!input || typeof input !== "object") return { error: "Invalid enquiry." };
  const body = input as Record<string, unknown>;
  const fullName = clean(body.fullName, 100);
  const phone = clean(body.phone, 40);
  const email = clean(body.email, 160).toLowerCase();
  const priceAware = clean(body.priceAware, 3);
  const landingUrl = clean(body.landingUrl, 700);
  const submittedAt = clean(body.submittedAt, 40);
  const idempotencyKey = clean(body.idempotencyKey, 80);
  const website = clean(body.website, 180);

  if (fullName.length < 2) return { error: "Please enter your full name." };
  if (!/^[-+()\s\d]{7,24}$/.test(phone)) return { error: "Please enter a valid phone number." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter a valid email address." };
  if (priceAware !== "Yes" && priceAware !== "No") return { error: "Please choose Yes or No for price awareness." };
  if (!/^[0-9a-f-]{30,80}$/i.test(idempotencyKey)) return { error: "Please refresh the page and try again." };

  const allowedAttribution = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid", "topic"];
  const suppliedAttribution = body.utm && typeof body.utm === "object" ? body.utm as Record<string, unknown> : {};
  const utm: Record<string, string> = {};
  for (const key of allowedAttribution) {
    const value = clean(suppliedAttribution[key], 180);
    if (value) utm[key] = value;
  }

  return { lead: { fullName, phone, email, priceAware, landingUrl, submittedAt, idempotencyKey, website, utm } };
}

export async function deliverLead(lead: LeadPayload, env: DeliveryEnvironment) {
  if (!env.RESEND_API_KEY || !env.ENQUIRIES_TO_EMAIL || !env.ENQUIRIES_FROM_EMAIL) {
    throw new Error("Enquiry delivery is awaiting final practice email configuration.");
  }

  const source = Object.entries(lead.utm ?? {}).map(([key, value]) => `${key}: ${value}`).join("\n") || "Direct / not available";
  // Use the server's clock (the browser's can be wrong) and show it in UK time for the practice team.
  const submitted = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", dateStyle: "full", timeStyle: "short" }).format(new Date());
  const pricingNote = lead.priceAware === "No" ? " – explain pricing" : "";
  const text = [
    "New Dr Attiya Ortho Enquiry",
    "",
    `Patient name: ${lead.fullName}`,
    `Phone number: ${lead.phone}`,
    `Email: ${lead.email}`,
    `Price awareness: ${lead.priceAware}${lead.priceAware === "No" ? " (not yet aware treatment starts from £1,999 – please explain pricing on the call)" : ""}`,
    `Date/time of submission: ${submitted}`,
    `Lead source/campaign:\n${source}`,
    `Landing-page URL: ${lead.landingUrl || "Not available"}`,
    "",
    "This enquiry contains contact details only. No appointment is confirmed and no payment has been taken.",
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
      "idempotency-key": `dr-attiya-${lead.idempotencyKey}`,
    },
    body: JSON.stringify({
      from: env.ENQUIRIES_FROM_EMAIL,
      to: [env.ENQUIRIES_TO_EMAIL],
      subject: `New Dr Attiya Ortho Enquiry – ${lead.fullName} (price aware: ${lead.priceAware}${pricingNote})`,
      text,
      html: `<h1>New Dr Attiya Ortho Enquiry</h1><table cellpadding="7" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif"><tr><td><strong>Patient name</strong></td><td>${escapeHtml(lead.fullName)}</td></tr><tr><td><strong>Phone number</strong></td><td>${escapeHtml(lead.phone)}</td></tr><tr><td><strong>Email</strong></td><td>${escapeHtml(lead.email)}</td></tr><tr><td><strong>Price awareness</strong></td><td>${escapeHtml(lead.priceAware)}${lead.priceAware === "No" ? " <strong>– please explain pricing on the call</strong>" : ""}</td></tr><tr><td><strong>Submitted</strong></td><td>${escapeHtml(submitted)}</td></tr><tr><td><strong>Lead source</strong></td><td><pre>${escapeHtml(source)}</pre></td></tr><tr><td><strong>Landing page</strong></td><td>${escapeHtml(lead.landingUrl || "Not available")}</td></tr></table><p>No appointment is confirmed and no payment has been taken.</p>`,
      reply_to: lead.email,
    }),
  });

  if (!response.ok) {
    console.error("Enquiry email provider rejected the request", response.status, response.headers.get("x-request-id") ?? "no-request-id");
    throw new Error(`Email provider rejected the request (HTTP ${response.status}).`);
  }
  return response.json().catch(() => ({}));
}
