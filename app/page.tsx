"use client";

import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePoundSterling,
  Clock3,
  Mail,
  MapPin,
  Phone,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

// Storage can throw in some private-browsing modes; never let that break the page.
function readStorage(storage: "local" | "session", key: string) {
  try { return (storage === "local" ? window.localStorage : window.sessionStorage).getItem(key); } catch { return null; }
}
function writeStorage(storage: "local" | "session", key: string, value: string) {
  try { (storage === "local" ? window.localStorage : window.sessionStorage).setItem(key, value); } catch { /* ignore */ }
}

// drattiyaortho.co.uk container in the NU Dental Tag Manager account (not secret).
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-PSXRJKVZ";
const DENTALIGN_ADDRESS = "The Showroom, Waud’s Gate, Baildon Road, Baildon, Shipley, BD17 6AB";
const TRACKING_PHONE_DISPLAY = process.env.NEXT_PUBLIC_TRACKING_PHONE_DISPLAY ?? "01274 003456";
const TRACKING_PHONE_E164 = process.env.NEXT_PUBLIC_TRACKING_PHONE_E164 ?? "+441274003456";
const TRACKING_PHONE_HREF = `tel:${TRACKING_PHONE_E164}`;
const MAP_URL = "https://www.google.com/maps/search/?api=1&query=Nu+Dentalign+The+Showroom+Wauds+Gate+Baildon+Road+Baildon+Shipley+BD17+6AB";
const MAP_EMBED_URL = "https://www.google.com/maps?q=Nu%20Dentalign%20The%20Showroom%20Wauds%20Gate%20Baildon%20Road%20Baildon%20Shipley%20BD17%206AB&output=embed";


const reviews = [
  {
    name: "Hassnain Hanif",
    initial: "H",
    avatarClass: "google-avatar--blue",
    context: "NuDental Google review",
    message: "I cannot recommend this dental practice enough! I recently started my Invisalign journey here, and the entire experience has been seamless. A huge shoutout to Zoey and Halima, who have both been absolutely amazing. They are so welcoming, professional, and took the time to answer all my questions and put my mind at ease. The attention to care here is top-notch. If you are thinking about getting Invisalign, this is definitely the place to go!",
  },
  {
    name: "Zahra R",
    initial: "Z",
    avatarClass: "google-avatar--violet",
    context: "NuDental Google review",
    message: "Finished my Spark aligner treatment with Nudental after a year and a half, and I'm really pleased with the results. The team are welcoming and always responsive to questions. The process was straightforward, and their communication was great throughout. The customer service from the whole team was outstanding from start to finish. Special thanks to Joanne & Lauren for making me feel at ease through the whole process of my teeth straightening journey. If you're considering straightening your teeth, I highly recommend Nudental for a 5* service.",
  },
  {
    name: "Saakib Ahmed",
    initial: "S",
    avatarClass: "google-avatar--green",
    context: "NuDental Google review",
    message: "NU Dental has been, and still is, my dentist for the past 2 years. I've had my Invisalign treatment with them and my regular hygienist appointments. The staff, in particular Lauren and Dr. Attiya, have been fantastic! An appointment with Lauren always felt like a catch-up with a good friend! The dentist has a luxurious atmosphere and a visit to the dentist never feels like a typical dentist appointment - I mean this in the best way possible! I have had some issues, but they were quickly rectified with outstanding customer service! I really appreciate how NU Dental have gone above and beyond to ensure I have a great experience.",
  },
  {
    name: "Lauren Conroy",
    initial: "L",
    avatarClass: "google-avatar--rose",
    context: "NuDental Google review",
    message: "Absolutley love everything about my treatment here!! I am currently having Invisalign treatment and I am so happy with how the results are turning out!! Always well taken care of by the amazing staff at NU Dental- so friendly, personable and professional!!!",
  },
  {
    name: "Karen Jackson",
    initial: "K",
    avatarClass: "google-avatar--orange",
    context: "NuDental Google review",
    message: "Great service! Really happy with my Invisalign experience. I would highly recommend NuDental.",
  },
  {
    name: "Shalima Bowers",
    initial: "S",
    avatarClass: "google-avatar--teal",
    context: "NuDental Google review",
    message: "I went in for a consultation for bonding composition and from start to finish the service was 10/10. Not only did the do a full health check of my teeth but they also advised whst process was needed first to get the desired resultsvi was looking for by starting with alignment first. The surgery was very clean and welcoming, decor was amazing! I felt that comfortable, I ended up picking them to do my treatment even though I had a list of other places to visit. Thank you so much!! I truly believe you’re going to transform my smile.",
  },
];

function track(event: string, details: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...details });
}

// Google Consent Mode v2 signal. Google tags read `arguments` objects from the dataLayer.
function gtag(..._args: unknown[]) {
  window.dataLayer = window.dataLayer ?? [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

function setConsent(granted: boolean) {
  const value = granted ? "granted" : "denied";
  gtag("consent", "update", { ad_storage: value, ad_user_data: value, ad_personalization: value, analytics_storage: value });
}

function loadGtm() {
  if (!GTM_ID || document.getElementById("dr-attiya-gtm")) return;
  window.dataLayer = window.dataLayer ?? [];
  // GTM only loads after the visitor accepts, so start from "denied" and immediately record the grant.
  gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" });
  setConsent(true);
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.id = "dr-attiya-gtm";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
  document.head.appendChild(script);
}

function scrollToForm(label: string) {
  track("cta_click", { cta_label: label });
  document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => document.getElementById("hero-fullName")?.focus(), 650);
}

function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <a className={`brand ${inverse ? "brand--inverse" : ""}`} href="#top" aria-label="Dr Attiya Ortho home">
      <span className="brand__monogram">AA</span>
      <span className="brand__text">
        <strong>Dr Attiya</strong>
        <small>ORTHO · NU DENTALIGN</small>
      </span>
    </a>
  );
}

function CtaButton({ label, className = "" }: { label: string; className?: string }) {
  return (
    <button className={`cta ${className}`} type="button" onClick={() => scrollToForm(label)}>
      <span>{label}</span>
      <ArrowRight size={18} aria-hidden="true" />
    </button>
  );
}

function HorizontalCarousel({ children, label, className = "" }: { children: ReactNode; label: string; className?: string }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(true);

  function updateControls() {
    const viewport = viewportRef.current;
    if (!viewport) return;
    setCanGoBack(viewport.scrollLeft > 4);
    setCanGoForward(viewport.scrollLeft + viewport.clientWidth < viewport.scrollWidth - 4);
  }

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    updateControls();
    viewport.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);
    return () => {
      viewport.removeEventListener("scroll", updateControls);
      window.removeEventListener("resize", updateControls);
    };
  }, []);

  function move(direction: -1 | 1) {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollBy({ left: direction * viewport.clientWidth, behavior: "smooth" });
  }

  return (
    <div className={`carousel ${className}`} aria-label={label}>
      <div className="carousel__viewport" ref={viewportRef} tabIndex={0}>
        <div className="carousel__track">{children}</div>
      </div>
      <div className="carousel__controls">
        <span>Swipe or use the arrows</span>
        <button type="button" onClick={() => move(-1)} disabled={!canGoBack} aria-label={`Previous ${label}`}><ChevronLeft /></button>
        <button type="button" onClick={() => move(1)} disabled={!canGoForward} aria-label={`Next ${label}`}><ChevronRight /></button>
      </div>
    </div>
  );
}

function PhoneLink({ label = TRACKING_PHONE_DISPLAY, className = "", placement }: { label?: string; className?: string; placement: string }) {
  return <a className={className} href={TRACKING_PHONE_HREF} onClick={() => track("phone_click", { placement })}><Phone size={16} aria-hidden="true" />{label}</a>;
}

function FinanceIllustration() {
  const options = [
    { months: 9, baseMonthly: 222.11, apr: "0% APR", baseTotal: 1999 },
    { months: 12, baseMonthly: 173.88, apr: "9.9% APR", baseTotal: 2086.56 },
    { months: 24, baseMonthly: 91.04, apr: "9.9% APR", baseTotal: 2184.96 },
    { months: 36, baseMonthly: 63.51, apr: "9.9% APR", baseTotal: 2286.36 },
    { months: 60, baseMonthly: 43.35, apr: "11.9% APR", baseTotal: 2601 },
  ];
  const [term, setTerm] = useState(9);
  const [amountInput, setAmountInput] = useState("1999");
  const inputId = "finance-treatment-total";
  const helpId = `${inputId}-help`;
  const amount = Math.min(20000, Math.max(1999, Number(amountInput) || 1999));
  const selected = options.find((option) => option.months === term) ?? options[0];
  const scale = amount / 1999;
  const monthly = selected.months === 9 ? amount / 9 : selected.baseMonthly * scale;
  const total = selected.months === 9 ? amount : selected.baseTotal * scale;
  const money = (value: number, minimumFractionDigits = 2) => new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(value);

  return (
    <div className="finance-planner finance-planner--standalone" aria-label="Monthly payment calculator">
      <div className="finance-planner__heading">
        <span><CirclePoundSterling size={18} /> Explore monthly payments</span>
        <small>Treatment from £1,999</small>
      </div>
      <label className="finance-amount" htmlFor={inputId}>
        <span>Estimated treatment total</span>
        <span className="finance-amount__field">
          <span aria-hidden="true">£</span>
          <input
            id={inputId}
            type="number"
            min="1999"
            max="20000"
            step="50"
            inputMode="decimal"
            value={amountInput}
            onChange={(event) => setAmountInput(event.target.value)}
            onBlur={() => setAmountInput(String(amount))}
            aria-describedby={helpId}
          />
        </span>
      </label>
      <input
        className="finance-range"
        type="range"
        min="1999"
        max="20000"
        step="100"
        value={amount}
        onChange={(event) => setAmountInput(event.target.value)}
        aria-label="Adjust estimated treatment total"
        aria-describedby={helpId}
      />
      <div className="finance-range__labels" aria-hidden="true"><span>£1,999</span><span>£20,000</span></div>
      <small className="finance-amount__help" id={helpId}>Type a treatment total or move the slider to see example payments.</small>
      <span className="finance-prompt">Choose a term</span>
      <div className="finance-tabs" role="group" aria-label="Choose a payment term">
        {options.map((option) => (
          <button key={option.months} type="button" className={term === option.months ? "is-active" : ""} aria-pressed={term === option.months} onClick={() => setTerm(option.months)}>
            <strong>{option.months}</strong><small>months</small>
          </button>
        ))}
      </div>
      <div className="finance-result" aria-live="polite">
        <span>{selected.months} monthly payments</span>
        <strong>{money(monthly)}<small> per month</small></strong>
        <div className="finance-result__details"><span>{selected.apr}</span><span>Total repayable {money(total)}</span></div>
      </div>
      <small className="finance-disclaimer">These are example payments only. Your final plan may be different. Finance is subject to status, affordability checks and lender terms.</small>
    </div>
  );
}

function LocationMap() {
  return (
    <div className="map-shell">
      <iframe title="Map showing Nu Dentalign in Baildon" src={MAP_EMBED_URL} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}

function EnquiryForm({ idPrefix, compact = false }: { idPrefix: string; compact?: boolean }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "accepted">("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", priceAware: "", website: "" });
  const hasStarted = useRef(false);
  // One key per enquiry, reused on retries so a double-tap or retry can't create two emails or two conversions.
  const enquiryKey = useRef("");

  function markFormStarted() {
    if (hasStarted.current) return;
    hasStarted.current = true;
    track("form_step_1_start", { form_id: idPrefix });
  }

  function continueToPrice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const node = event.currentTarget;
    if (!node.reportValidity()) return;
    track("form_step_1_completed", { form_id: idPrefix });
    track("form_step_2_viewed", { form_id: idPrefix });
    setStep(2);
    window.setTimeout(() => document.getElementById(`${idPrefix}-price-awareness-yes`)?.focus(), 80);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.priceAware) {
      setError("Please choose Yes or No. Both answers are welcome.");
      return;
    }
    setStatus("sending");
    setError("");
    track("price_awareness_selected", { answer: form.priceAware.toLowerCase(), form_id: idPrefix });
    track("final_form_submission", { form_id: idPrefix });

    try {
      const savedAttribution = readStorage("session", "dr-attiya-utm");
      let utm = {};
      try { utm = savedAttribution ? JSON.parse(savedAttribution) : {}; } catch { utm = {}; }
      if (!enquiryKey.current) enquiryKey.current = crypto.randomUUID();
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          utm,
          landingUrl: window.location.href,
          submittedAt: new Date().toISOString(),
          idempotencyKey: enquiryKey.current,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) throw new Error(result?.message || `We couldn’t send your enquiry just now. Please try again or call ${TRACKING_PHONE_DISPLAY}.`);
      // enquiry_id is a random reference (no personal data) that Google Ads can use to de-duplicate conversions.
      track("enquiry_accepted", { price_awareness: form.priceAware.toLowerCase(), form_id: idPrefix, enquiry_id: enquiryKey.current });
      setStatus("accepted");
    } catch (submissionError) {
      setStatus("error");
      setError(submissionError instanceof Error ? submissionError.message : "Please try again or call NuDental.");
    }
  }

  if (status === "accepted") {
    return (
      <div className={`form-shell form-shell--success ${compact ? "form-shell--hero" : ""}`} role="status" aria-live="polite">
        <div className="success-mark"><Check /></div>
        <span className="eyebrow">Enquiry received</span>
        <h2>Thank you. NuDental will be in touch.</h2>
        <p>Your enquiry has been accepted. The team will contact you to discuss the next step. No appointment has been confirmed and no payment has been taken.</p>
        <PhoneLink className="cta cta--full" label={`Call ${TRACKING_PHONE_DISPLAY}`} placement={`${idPrefix}_success`} />
      </div>
    );
  }

  return (
    <div className={`form-shell ${compact ? "form-shell--hero" : ""}`}>
      <div className="form-shell__progress" aria-label={`Step ${step} of 2`}>
        <span className="is-complete">1</span><i className={step === 2 ? "is-complete" : ""} /><span className={step === 2 ? "is-complete" : ""}>2</span>
      </div>
      {step === 1 ? (
        <form onSubmit={continueToPrice} onFocus={markFormStarted}>
          <span className="eyebrow">Step 1 of 2 · contact details</span>
          <h2>Find Out How We Can Straighten Your Smile.</h2>
          <p>Leave your details, answer one quick question, and you’re done.</p>
          <label htmlFor={`${idPrefix}-fullName`}>Full name</label>
          <input id={`${idPrefix}-fullName`} name="fullName" autoComplete="name" enterKeyHint="next" maxLength={100} required value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
          <div className="form-row">
            <div>
              <label htmlFor={`${idPrefix}-phone`}>Phone number</label>
              <input id={`${idPrefix}-phone`} name="phone" type="tel" autoComplete="tel" inputMode="tel" enterKeyHint="next" maxLength={24} pattern={"[\\d\\s\\(\\)\\+\\-]{7,24}"} title="Please enter a phone number using digits, spaces or +" required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            </div>
            <div>
              <label htmlFor={`${idPrefix}-email`}>Email address</label>
              <input id={`${idPrefix}-email`} name="email" type="email" autoComplete="email" inputMode="email" enterKeyHint="go" maxLength={160} required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </div>
          </div>
          <div className="honeypot" aria-hidden="true">
            <label htmlFor={`${idPrefix}-website`}>Website</label>
            <input id={`${idPrefix}-website`} name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} />
          </div>
          <button className="cta cta--full" type="submit">Continue <ArrowRight size={18} /></button>
          <p className="form-note">By continuing, you’re asking NuDental to call or email you about this enquiry. See our <a href="https://www.nudental.co.uk/wp-content/uploads/2022/02/nu-dental-privacy-policy.pdf" target="_blank" rel="noreferrer">privacy notice</a>.</p>
        </form>
      ) : (
        <form onSubmit={submit}>
          <span className="eyebrow">Step 2 of 2 · one quick question</span>
          <h2>Just One More Thing...</h2>
          <div className="price-panel">
            <span>Clear Aligner Treatment</span>
            <strong>From £1,999</strong>
            <small>Your final fee depends on clinical suitability and your personalised treatment plan. The £25 assessment fee is separate.</small>
            <div className="price-panel__included" aria-label="Clear aligner package inclusions">
              <span><Check size={13} /> Prescribed aligners</span>
              <span><Check size={13} /> Teeth whitening</span>
              <span><Check size={13} /> End-of-treatment retainer</span>
            </div>
          </div>
          <fieldset>
            <legend>Are you aware that clear aligner treatment starts from £1,999?</legend>
            <div className="radio-grid">
              {["Yes", "No"].map((answer) => (
                <label key={answer} className={form.priceAware === answer ? "is-selected" : ""}>
                  <input id={answer === "Yes" ? `${idPrefix}-price-awareness-yes` : undefined} type="radio" name={`${idPrefix}-priceAware`} value={answer} checked={form.priceAware === answer} onChange={(event) => setForm({ ...form, priceAware: event.target.value })} />
                  <span>{answer}</span>
                  {form.priceAware === answer && <Check size={18} />}
                </label>
              ))}
            </div>
          </fieldset>
          {form.priceAware === "No" && <p className="kind-note">That’s completely fine. The NuDental team can explain pricing when they contact you.</p>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="cta cta--full" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending securely…" : "Confirm My Enquiry"} <ArrowRight size={18} /></button>
          <button className="back-button" type="button" onClick={() => { setStep(1); setStatus("idle"); setError(""); }}>← Back to contact details</button>
          <p className="form-note">By submitting, you’re asking NuDental to call or email you about this enquiry. See our <a href="https://www.nudental.co.uk/wp-content/uploads/2022/02/nu-dental-privacy-policy.pdf" target="_blank" rel="noreferrer">privacy notice</a>.</p>
        </form>
      )}
    </div>
  );
}

function CookieBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const choice = readStorage("local", "dr-attiya-cookie-choice");
    if (choice === "accepted") loadGtm();
    if (!choice) window.setTimeout(() => setVisible(true), 0);
    const reopen = () => setVisible(true);
    window.addEventListener("dr-attiya-cookie-settings", reopen);
    return () => window.removeEventListener("dr-attiya-cookie-settings", reopen);
  }, []);
  if (!visible) return null;
  function choose(choice: "accepted" | "rejected") {
    writeStorage("local", "dr-attiya-cookie-choice", choice);
    if (choice === "accepted") loadGtm();
    // If tags were already running and the visitor now opts out, tell them to stop.
    else if (document.getElementById("dr-attiya-gtm")) setConsent(false);
    setVisible(false);
  }
  return (
    <aside className="cookie-banner" aria-label="Cookie choices">
      <div><strong>Your privacy matters</strong><p>With your permission, we use optional analytics and advertising cookies (including Google) to see which adverts lead to enquiries. Your name, phone number and email are never shared with them.</p></div>
      <div className="cookie-banner__actions"><button type="button" onClick={() => choose("rejected")}>Reject optional</button><button className="accept" type="button" onClick={() => choose("accepted")}>Accept</button></div>
    </aside>
  );
}

export default function Home() {
  useEffect(() => {
    track("page_view", { page_path: window.location.pathname });
    const params = new URLSearchParams(window.location.search);
    const attribution: Record<string, string> = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid"].forEach((key) => {
      const value = params.get(key);
      if (value) attribution[key] = value.slice(0, 180);
    });
    if (Object.keys(attribution).length) writeStorage("session", "dr-attiya-utm", JSON.stringify(attribution));
  }, []);

  return (
    <main id="top">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="address-bar">
        <div className="container address-bar__inner">
          <PhoneLink className="address-call" label={TRACKING_PHONE_DISPLAY} placement="top_bar" />
          <span className="address-full"><MapPin size={15} aria-hidden="true" /> Nu Dentalign · {DENTALIGN_ADDRESS}</span>
          <span className="address-mobile"><MapPin size={15} aria-hidden="true" /> Nu Dentalign · Waud’s Gate, Baildon, Shipley, BD17 6AB</span>
          <a href={MAP_URL} target="_blank" rel="noreferrer">Directions <ArrowRight size={12} /></a>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <BrandMark />
          <PhoneLink className="header-phone" placement="header" />
          <CtaButton label="Check My Suitability" className="header-cta" />
        </div>
      </header>

      <section className="hero section" id="main-content" aria-labelledby="hero-title" tabIndex={-1}>
        <div className="hero__decor hero__decor--one" /><div className="hero__decor hero__decor--two" />
        <div className="container hero__grid hero__grid--clinician">
          <div className="hero__copy">
            <span className="eyebrow">Clear aligners · Bradford &amp; Baildon</span>
            <h1 id="hero-title">Meet Dr Attiya.</h1>
            <p className="hero__lead">Clear aligners and braces in Bradford, thoughtfully planned around you.</p>
            <CtaButton label="Check My Suitability" className="hero-primary-cta" />
            <PhoneLink className="hero-phone" label={`Or call ${TRACKING_PHONE_DISPLAY}`} placement="hero" />
            <div className="trust-row" aria-label="Trust indicators">
              <span><Star size={18} fill="currentColor" />4.9 Google rating</span>
              <span><BadgeCheck size={18} />GDC registered dentist</span>
              <span><MapPin size={18} />Baildon, Bradford</span>
            </div>
          </div>
          <figure className="hero-portrait">
            <img src="/images/attiya-portrait-highres-1100.webp" srcSet="/images/attiya-portrait-highres-640.webp 640w, /images/attiya-portrait-highres-1100.webp 1100w" sizes="(max-width: 760px) 92vw, 46vw" width="1100" height="1649" fetchPriority="high" decoding="async" alt="Dr Attiya Ahmed at NuDental in Baildon" />
            <figcaption><small>Your clinician</small><strong>Dr Attiya Ahmed</strong><span>Teeth-straightening dentist · GDC 245279</span></figcaption>
          </figure>
        </div>
      </section>

      <section className="proof-strip" aria-label="Dr Attiya and NuDental experience">
        <div className="container proof-strip__grid">
          <div><strong>1,000+</strong><span>Orthodontic cases</span><small>Across the NuDental orthodontic team</small></div>
          <div><strong>4.9★</strong><span>Google rating</span><small>From 500+ practice-wide reviews</small></div>
          <div><strong>0%</strong><span>Finance available</span><small>Other options up to five years · subject to status</small></div>
          <div><strong>13+</strong><span>Years in dentistry</span><small>Dr Attiya qualified in 2013</small></div>
        </div>
      </section>

      <section className="section hero-form-section" id="enquire" aria-labelledby="start-title">
        <div className="container hero-form-section__grid">
          <div className="hero-form-section__intro"><span className="eyebrow">Start here</span><h2 id="start-title">Take the first step.</h2><p>Leave your details and the NuDental team will contact you.</p><div className="mini-proof"><span><Check />Two short steps</span><span><Check />Takes about a minute</span><span><Check />No obligation</span></div><PhoneLink className="form-phone" label={`Prefer to talk? Call ${TRACKING_PHONE_DISPLAY}`} placement="hero_form" /></div>
          <EnquiryForm idPrefix="hero" compact />
        </div>
      </section>

      <section className="section transformations" id="results" aria-labelledby="results-title">
        <div className="container">
          <div className="section-heading"><span className="eyebrow">Real patients. Real care.</span><h2 id="results-title">Smile transformations</h2><p>A selection of genuine NuDental teeth-straightening cases. Every smile and treatment journey is individual.</p></div>
          <HorizontalCarousel className="transformation-carousel" label="smile transformations">
            {["case-01-clean-800.webp", "case-02-clean-640.webp", "case-03-clean-800.webp", "case-04-clean-800.webp"].map((file, index) => (
              <figure className="case-card case-card--single" key={file}>
                <div className="case-card__media">
                  <span className="case-label case-label--before">Before</span>
                  <span className="case-label case-label--after">After</span>
                  <img src={`/images/${file}`} loading="lazy" decoding="async" alt={`Before-and-after teeth-straightening case ${String(index + 1).padStart(2, "0")}`} />
                </div>
              </figure>
            ))}
            {[
              { before: "case-05-before-900.webp", after: "case-05-after-900.webp", number: "05" },
              { before: "case-06-before-900.webp", after: "case-06-after-900.webp", number: "06" },
            ].map((item) => (
              <figure className="case-card case-card--paired" key={item.number}>
                <div className="case-pair">
                  <div className="case-pair__image"><span className="case-label">Before</span><img src={`/images/${item.before}`} loading="lazy" decoding="async" alt={`Before clear aligner treatment, case ${item.number}`} /></div>
                  <div className="case-pair__divider" aria-label="NuDental"><img src="/images/nudental-logo.svg" width="189" height="124" alt="" /></div>
                  <div className="case-pair__image"><span className="case-label">After</span><img src={`/images/${item.after}`} loading="lazy" decoding="async" alt={`After clear aligner treatment, case ${item.number}`} /></div>
                </div>
              </figure>
            ))}
          </HorizontalCarousel>
          <p className="case-compliance">Images illustrate previous cases and do not guarantee a particular result.</p>
          <div className="centered-cta"><CtaButton label="Check My Suitability" /></div>
        </div>
      </section>

      <section className="section testimonial-video" aria-labelledby="patient-stories-title">
        <div className="container">
          <div className="section-heading testimonial-video__heading"><span className="eyebrow">Real patient experiences</span><h2 id="patient-stories-title">Hear from our patients.</h2><p>Patients share their experiences of care and teeth-straightening treatment at NuDental.</p></div>
          <div className="testimonial-video__cards">
            {[
              { name: "Aamina", poster: "/images/aamina-testimonial-poster-400.webp", video: "/videos/aamina-testimonial.m4v" },
              { name: "Sara", poster: "/images/sara-testimonial-poster-400.webp", video: "/videos/sara-testimonial.m4v" },
              { name: "Kasia", poster: "/images/kasia-testimonial-poster-800.webp", video: "/videos/kasia-testimonial.m4v" },
            ].map((story) => (
              <article className="testimonial-video__card" key={story.name}>
                <div className="testimonial-video__media"><video controls playsInline preload="none" poster={story.poster} aria-label={`${story.name} shares her experience of care at NuDental`}><source src={story.video} type="video/mp4" />Your browser does not support embedded video.</video></div>
                <div className="testimonial-video__caption"><h3>{story.name}’s story</h3><p>A personal experience of care at NuDental.</p></div>
              </article>
            ))}
          </div>
          <p className="testimonial-video__note">Individual experiences and treatment outcomes vary.</p>
        </div>
      </section>

      <section className="section about" id="about" aria-labelledby="about-title">
        <div className="container about__grid">
          <div className="about__visual"><img className="about__image" src="/images/attiya-with-patients-400.webp" width="400" height="551" loading="lazy" decoding="async" alt="Dr Attiya Ahmed with patients at Nu Dentalign" /><div className="clinic-inset"><img src="/images/clinic-sign-710.webp" width="710" height="748" loading="lazy" decoding="async" alt="Nu Dentalign reception sign" /><span>Nu Dentalign · Baildon</span></div></div>
          <div className="about__copy"><span className="eyebrow">Why choose Dr Attiya?</span><h2 id="about-title">Thoughtful orthodontic care, centred on you.</h2><p>Dr Attiya Ahmed is NuDental’s Principal Dentist, with more than 13 years’ experience. She provides personalised clear aligner and fixed-brace treatment for adults and children, combining postgraduate orthodontic training with careful planning and clear explanations.</p><div className="credential-list"><span><Check />Postgraduate Certificate in Orthodontics</span><span><Check />Currently completing a Postgraduate Diploma in Orthodontics</span><span><Check />Postgraduate Certificate in Restorative Dentistry</span><span><Check />Dentist · GDC 245279</span></div><CtaButton label="Check My Suitability" /></div>
        </div>
      </section>

      <section className="section difference" id="difference" aria-labelledby="difference-title">
        <div className="container">
          <div className="difference__intro"><span className="eyebrow">Smile-led clear aligner planning</span><h2 id="difference-title">What makes Dr Attiya’s approach different?</h2><p>It starts with understanding why your teeth sit where they do—not simply making them look straighter. Your bite, tooth position, smile and long-term stability are considered together.</p></div>
          <div className="difference__grid">
            <article className="difference-card difference-card--image">
              <img src="/images/package-itero.webp" width="236" height="213" loading="lazy" decoding="async" alt="A patient viewing an iTero digital scan during a clear aligner assessment" />
              <div><span>01 · See it in 3D</span><h3>Scan and illustrative simulation</h3><p>An iTero 3D scan is taken during your full smile assessment. Where appropriate, an illustrative simulation helps you discuss a possible direction before deciding.</p></div>
            </article>
            <article className="difference-card"><span>02 · Look beyond the front teeth</span><h3>The “why” behind your tooth position</h3><p>Dr Attiya assesses your smile, bite, spacing, crowding and oral health to understand what needs to change and which movements may be suitable.</p></article>
            <article className="difference-card"><span>03 · Personally planned</span><h3>One plan, monitored in practice</h3><p>Your treatment is planned around your individual teeth and reviewed by the NuDental team, with adjustments made when clinically appropriate.</p></article>
            <article className="difference-card difference-card--image">
              <img src="/images/spark-aligner-800.webp" width="800" height="585" loading="lazy" decoding="async" alt="Clear aligner model used to explain dentist-led teeth straightening" />
              <div><span>04 · Finish with stability in mind</span><h3>Alignment, whitening and retention</h3><p>The clear aligner package includes professional whitening where suitable and one end-of-treatment retainer, with your retention plan explained clearly.</p></div>
            </article>
          </div>
          <p className="difference__note">The digital simulation is illustrative, not a guaranteed treatment outcome. Suitability and final treatment planning require a clinical assessment.</p>
          <div className="centered-cta"><CtaButton label="See What May Be Possible" /></div>
        </div>
      </section>

      <section className="section clinic-gallery" aria-labelledby="clinic-gallery-title">
        <div className="container">
          <div className="section-heading"><span className="eyebrow">Inside Nu Dentalign</span><h2 id="clinic-gallery-title">A welcoming place to start.</h2><p>Meet the team, see the practice and explore your options in Baildon.</p></div>
          <div className="clinic-gallery__grid">
            <figure className="clinic-gallery__item clinic-gallery__item--wide"><img src="/images/consultation-tablet-891.webp" width="891" height="604" loading="lazy" decoding="async" alt="A patient using a tablet during a visit to Nu Dentalign" /></figure>
            <figure className="clinic-gallery__item"><img src="/images/clinic-reception-407.webp" width="407" height="336" loading="lazy" decoding="async" alt="Nu Dentalign reception and waiting area in Baildon" /></figure>
            <figure className="clinic-gallery__item"><img src="/images/clinic-exterior-840.webp" width="840" height="826" loading="lazy" decoding="async" alt="Nu Dentalign exterior in Baildon" /></figure>
            <figure className="clinic-gallery__item clinic-gallery__item--sign"><img src="/images/clinic-sign-710.webp" width="710" height="748" loading="lazy" decoding="async" alt="Nu Dentalign interior sign" /></figure>
          </div>
        </div>
      </section>

      <section className="section treatments" aria-labelledby="treatments-title">
        <div className="container"><div className="section-heading section-heading--left"><span className="eyebrow">Compare your options</span><h2 id="treatments-title">Clear aligners or fixed braces in Bradford?</h2><p>Neither option is automatically better. Dr Attiya will assess your teeth and bite, then explain which approach may be clinically suitable for your smile.</p></div>
          <div className="treatment-table-wrap" role="region" aria-label="Clear aligners and fixed braces comparison" tabIndex={0}>
            <table className="treatment-table">
              <thead><tr><th scope="col">What matters</th><th scope="col"><span>Clear aligners</span><small>Removable transparent trays</small></th><th scope="col"><span>Fixed braces</span><small>Brackets and wires</small></th></tr></thead>
              <tbody>
                <tr><th scope="row">Visibility</th><td>Discreet and nearly invisible when worn</td><td>Visible, with metal or more discreet options</td></tr>
                <tr><th scope="row">Eating and cleaning</th><td>Remove for meals, brushing and flossing</td><td>Stay in place; cleaning needs extra care</td></tr>
                <tr><th scope="row">Daily routine</th><td>Usually worn for around 20–22 hours a day</td><td>Work continuously without removal</td></tr>
                <tr><th scope="row">Planning</th><td>Digitally planned using a 3D scan</td><td>Planned through clinical records and regular adjustments</td></tr>
                <tr><th scope="row">May suit</th><td>Many mild, moderate and selected complex movements</td><td>A broad range of movements, including some more complex needs</td></tr>
              </tbody>
            </table>
          </div>
          <p className="treatment-table-note">Treatment type, duration and cost depend on clinical suitability. Clear aligners require consistent wear; fixed braces may be recommended where they offer greater control.</p>
          <div className="package-showcase" aria-labelledby="package-title">
            <div className="package-showcase__heading">
              <span className="eyebrow">Included in your package</span>
              <h3 id="package-title">More than just your aligners.</h3>
              <p>Your clear aligner package includes digital planning, professional teeth whitening and one end-of-treatment retainer.</p>
            </div>
            <div className="package-showcase__grid">
              <article className="package-showcase__card">
                <div className="package-showcase__image"><img src="/images/spark-aligner-800.webp" width="800" height="585" loading="lazy" decoding="async" alt="Clear aligner model used as part of digital orthodontic planning at NuDental" /></div>
                <div className="package-showcase__content"><span>01</span><h4>Digitally planned aligners</h4><p>An iTero 3D scan helps Dr Attiya plan your prescribed clear aligners.</p></div>
              </article>
              <article className="package-showcase__card">
                <div className="package-showcase__image"><img src="/images/package-whitening-hd-700.webp" width="700" height="633" loading="lazy" decoding="async" alt="Whitening gel being placed into a clear dental tray" /><strong className="package-badge">Free</strong></div>
                <div className="package-showcase__content"><span>02</span><h4>Professional whitening</h4><p>Included after straightening where clinically suitable.</p><small>Normally £315</small></div>
              </article>
              <article className="package-showcase__card">
                <div className="package-showcase__image"><img src="/images/package-retainer-hd-700.webp" width="700" height="632" loading="lazy" decoding="async" alt="A person placing a clear orthodontic retainer over their teeth" /><strong className="package-badge">Free</strong></div>
                <div className="package-showcase__content"><span>03</span><h4>One final retainer</h4><p>Included at the end of treatment to help maintain tooth position.</p><small>Normally £400</small></div>
              </article>
            </div>
            <p className="package-showcase__note">Whitening is subject to clinical suitability. Retainer type and scope are confirmed in your individual treatment plan.</p>
            <div className="package-showcase__cta"><CtaButton label="Check My Suitability" /></div>
          </div>
        </div>
      </section>

      <section className="section assessment" id="assessment" aria-labelledby="assessment-title">
        <div className="container"><div className="assessment__intro"><div><span className="eyebrow eyebrow--soft">Full Smile Assessment</span><h2 id="assessment-title">More Than Just a Consultation.</h2></div><p>Get a full smile assessment, a 3D scan and a personalised treatment plan—so you can understand your options before deciding.</p></div><div className="assessment-price" aria-label="Full Smile Assessment £25"><span>Full Smile Assessment</span><div><strong>£25</strong></div><p>One clear assessment fee. Treatment fees are discussed separately after Dr Attiya has assessed your smile.</p></div><div className="assessment-grid">
          <article><ScanLine /><span>01</span><h3>See your smile in 3D</h3><p>An iTero digital scan, with an illustrative smile simulation where appropriate.</p></article>
          <article><ShieldCheck /><span>02</span><h3>Understand your bite</h3><p>A comprehensive look at your teeth, smile, bite and oral health.</p></article>
          <article><Sparkles /><span>03</span><h3>Explore your options</h3><p>Clear aligners, fixed braces and likely timings explained simply.</p></article>
          <article><Clock3 /><span>04</span><h3>Leave with a plan</h3><p>Your individual treatment estimate and expected journey, with small X-rays only when clinically indicated.</p></article>
        </div><div className="assessment__footer"><p>A digital simulation is illustrative and does not guarantee a final treatment result. Treatment depends on clinical suitability.</p><CtaButton label="Check My Suitability" /></div></div>
      </section>

      <section className="section reviews" id="reviews" aria-labelledby="reviews-title">
        <div className="container"><div className="section-heading"><span className="eyebrow">Patient feedback</span><h2 id="reviews-title">Care that feels clear and reassuring.</h2><p>Full messages from practice-wide NuDental Google reviews, including feedback about clear aligners and teeth straightening.</p></div><HorizontalCarousel className="review-carousel" label="patient reviews">{reviews.map((review) => <figure key={review.name}><div className="google-review-top"><span className={`review-avatar ${review.avatarClass}`} aria-hidden="true">{review.initial}</span><span><strong>{review.name}</strong><small>{review.context}</small></span><span className="google-mark" aria-label="Google review">G</span></div><div className="stars" aria-label="Five stars">{[0,1,2,3,4].map((star) => <Star key={star} size={15} fill="currentColor" />)}</div><blockquote>{review.message}</blockquote></figure>)}</HorizontalCarousel><a className="text-link" href={MAP_URL} target="_blank" rel="noreferrer">Read Nu Dentalign reviews on Google <ArrowRight size={16} /></a><p className="review-note">These reviews relate to NuDental as a practice. Individual experiences and treatment outcomes vary.</p></div>
      </section>

      <section className="form-section section" id="final-enquire" aria-labelledby="form-title">
        <div className="container form-section__grid"><div className="form-section__copy"><span className="eyebrow">Take the first step</span><h2 id="form-title">Ready to understand your options?</h2><p>Request contact from the NuDental team about a full £25 smile assessment with Dr Attiya.</p><div className="contact-points"><PhoneLink label={TRACKING_PHONE_DISPLAY} placement="final_form" /><span><MapPin />{DENTALIGN_ADDRESS}</span><span><Mail />Your enquiry goes directly to NuDental</span></div><div className="next-steps"><strong>What happens next?</strong><ol><li><span>1</span>Send your enquiry</li><li><span>2</span>NuDental calls you</li><li><span>3</span>Choose an assessment time</li></ol></div></div><EnquiryForm idPrefix="final" /></div>
      </section>

      <section className="section faq" aria-labelledby="faq-title">
        <div className="container faq__grid"><div><span className="eyebrow">A few quick answers</span><h2 id="faq-title">Frequently asked questions</h2><p>Anything else? The NuDental team will be happy to help when they contact you.</p></div><div className="faq-list">
          {[
            ["Can I pay monthly?", "Yes. We offer 0% finance for up to one year. Other payment plans are available for up to five years. Finance is subject to status and lender checks. We will explain the options before you decide."],
            ["Where can I get clear aligners in Bradford?", `Dr Attiya provides dentist-led clear aligner treatment at Nu Dentalign, ${DENTALIGN_ADDRESS}. The practice is convenient for patients from Bradford, Shipley, Baildon, Bingley, Keighley, Silsden, Otley and Leeds.`],
            ["Do you offer Invisalign in Bradford?", "We offer clear aligners rather than an Invisalign-branded package. Invisalign is one brand of clear aligner. Dr Attiya will explain the system we use and whether it may suit your teeth and bite."],
            ["How much do clear aligners cost in Bradford?", "Clear aligner treatment starts from £1,999. Your final price depends on your teeth and treatment plan. At your £25 smile assessment, Dr Attiya will check your smile and give you a personal estimate."],
            ["Can I see a 3D smile simulation before treatment?", "Yes, where it is helpful. Your assessment includes an iTero 3D scan. Dr Attiya may also show you a digital smile preview. It is a guide, not a promise of the final result."],
            ["Who plans and checks my treatment?", "Dr Attiya and the NuDental clinical team plan your treatment and check your progress at the practice. They will explain each step and any changes that may be needed."],
            ["What does the £25 assessment include?", "Dr Attiya will check your smile, teeth and bite. You will have an iTero 3D scan, hear which options may suit you and receive an estimated price and timeline. Small X-rays are only taken if they are needed."],
            ["Will clear aligners suit me?", "They do not suit everyone. It depends on your teeth, bite and oral health. Dr Attiya will explain whether clear aligners, fixed braces or another option may be better for you."],
            ["How long does clear aligner treatment take?", "Everyone is different. The time depends on how much your teeth need to move and how often you wear your aligners. Dr Attiya will give you an estimated timeline after your scan."],
            ["Can I eat and drink with clear aligners?", "Take your aligners out to eat and for drinks other than plain water. Clean your teeth before putting them back in. We will show you how to look after them."],
            ["Do clear aligners hurt?", "You may feel some pressure or tenderness when you start a new aligner. This usually settles quickly. Please call us if pain is strong or does not settle."],
            ["How often will I visit NuDental?", "This depends on your plan and progress. Dr Attiya will tell you how often she needs to see you before treatment starts."],
            ["What is included in the clear aligner package?", "Your package includes your prescribed aligners, professional teeth whitening where suitable and one retainer at the end of treatment. Your written plan will confirm everything that is included."],
            ["Are clear aligners the same as invisible braces?", "People often use ‘invisible braces’ to mean discreet teeth straightening. Clear aligners are clear trays that you can remove. Fixed braces stay on your teeth and use brackets and wires."],
            ["Will I need retainers afterwards?", "Yes, most people need retainers after teeth straightening to help keep their teeth in place. One end-of-treatment retainer is included in the clear aligner package. Dr Attiya will explain how to wear it."],
            ["Does submitting the form book an appointment?", "No. It asks the NuDental team to contact you. They will discuss your enquiry and arrange an appointment separately."],
            ["Where can I have clear aligner treatment near Bradford?", `Nu Dentalign is at ${DENTALIGN_ADDRESS}, serving Bradford and surrounding areas including Bingley, Keighley, Leeds, Silsden and Otley.`],
          ].map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown aria-hidden="true" /></summary><p>{answer}</p></details>)}
        </div></div>
      </section>

      <section className="section finance-section" id="finance" aria-labelledby="finance-title">
        <div className="container finance-section__grid">
          <div className="finance-section__copy"><span className="eyebrow">Payment options</span><h2 id="finance-title">See example monthly payments.</h2><p>Change the treatment total, then choose a payment term to see an example.</p><div className="finance-section__points"><span><Check />0% finance is available</span><span><Check />Other options up to five years</span><span><Check />Ask our team before you decide</span></div><CtaButton label="Ask About Payment Options" /></div>
          <FinanceIllustration />
        </div>
      </section>

      <section className="section location" id="location" aria-labelledby="location-title">
        <div className="container location__grid">
          <div className="location__copy"><span className="eyebrow">Find us in Baildon</span><h2 id="location-title">Your smile assessment at Nu Dentalign.</h2><p className="location-address">{DENTALIGN_ADDRESS}</p><div className="location__details"><span><MapPin />Near Shipley and Bradford</span><PhoneLink label={TRACKING_PHONE_DISPLAY} placement="location" /></div><div className="location__actions"><a className="cta" href={MAP_URL} target="_blank" rel="noreferrer">Open directions <ArrowRight size={18} /></a><PhoneLink className="text-link" label="Call the practice" placement="location_secondary" /></div></div>
          <LocationMap />
        </div>
      </section>

      <footer className="footer"><div className="container footer__grid"><div><BrandMark inverse /><p>Clinician-led teeth straightening at Nu Dentalign in Baildon, Shipley.</p></div><div><strong>Visit</strong><p>The Showroom, Waud’s Gate<br />Baildon Road, Baildon<br />Shipley, BD17 6AB</p></div><div><strong>Contact</strong><p><PhoneLink label={TRACKING_PHONE_DISPLAY} placement="footer" /><br /><a href="https://www.nudental.co.uk/" target="_blank" rel="noreferrer">NuDental website</a></p></div><div><strong>Information</strong><p><a href="https://www.nudental.co.uk/wp-content/uploads/2022/02/nu-dental-privacy-policy.pdf" target="_blank" rel="noreferrer">Privacy notice</a><br /><a href="https://www.nudental.co.uk/complaints-policy-procedure/" target="_blank" rel="noreferrer">Complaints procedure</a><br /><a href="https://www.gdc-uk.org/" target="_blank" rel="noreferrer">General Dental Council</a><br /><button className="footer-link-button" type="button" onClick={() => window.dispatchEvent(new Event("dr-attiya-cookie-settings"))}>Cookie settings</button></p></div></div><div className="container footer__bottom"><span>© {new Date().getFullYear()} NuDental. All rights reserved.</span><span>Dr Attiya Ahmed · Dentist · GDC 245279 · Last updated 28 October 2026</span></div></footer>

      <div className="mobile-sticky"><PhoneLink className="mobile-sticky__call" label="Call" placement="mobile_sticky" /><CtaButton label="Check My Suitability" /></div>
      <CookieBanner />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": ["Dentist", "LocalBusiness"], "@id": "https://drattiyaortho.co.uk/#practice", name: "Nu Dentalign by NuDental", url: "https://drattiyaortho.co.uk/", telephone: TRACKING_PHONE_E164, address: { "@type": "PostalAddress", streetAddress: "The Showroom, Waud’s Gate, Baildon Road", addressLocality: "Baildon, Shipley", addressRegion: "West Yorkshire", postalCode: "BD17 6AB", addressCountry: "GB" }, areaServed: ["Baildon", "Shipley", "Bradford", "Bingley", "Keighley", "Leeds", "Silsden", "Otley"] },
          { "@type": "Person", "@id": "https://drattiyaortho.co.uk/#dr-attiya", name: "Dr Attiya Ahmed", jobTitle: "Dentist", identifier: "GDC 245279", worksFor: { "@id": "https://drattiyaortho.co.uk/#practice" } },
          { "@type": "Service", name: "Clear aligners, invisible braces and teeth-straightening assessment", provider: { "@id": "https://drattiyaortho.co.uk/#practice" }, areaServed: "Bradford and surrounding areas", offers: { "@type": "Offer", price: "25", priceCurrency: "GBP", description: "Full smile assessment. Treatment fees are separate." } }
        ]
      }) }} />
    </main>
  );
}
