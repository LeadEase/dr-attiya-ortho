import { Check, Phone } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Thank You | Dr Attiya Ortho",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <main className="thank-you">
      <section className="thank-you__card">
        <div className="thank-you__icon"><Check /></div>
        <span className="eyebrow">Enquiry received</span>
        <h1>Thank you. NuDental will be in touch.</h1>
        <p>Your enquiry has been accepted and the practice team will contact you to discuss the next step. No appointment has been confirmed and no payment has been taken.</p>
        <div className="thank-you__actions">
          <a className="cta" href={`tel:${process.env.NEXT_PUBLIC_TRACKING_PHONE_E164 ?? "+441274003456"}`}><Phone size={17} /> Call {process.env.NEXT_PUBLIC_TRACKING_PHONE_DISPLAY ?? "01274 003456"}</a>
          <Link href="/">Return to the page</Link>
        </div>
      </section>
    </main>
  );
}
