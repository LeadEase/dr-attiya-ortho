import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://drattiyaortho.co.uk"),
  title: "Clear Aligners & Teeth Straightening Bradford | Dr Attiya Ahmed",
  description: "Book a £25 full smile assessment with Dr Attiya Ahmed at Nu Dentalign in Baildon, near Shipley and Bradford. Explore clear aligners, teeth straightening and fixed braces with a 3D scan and personalised plan.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://drattiyaortho.co.uk/",
    siteName: "Dr Attiya Ortho",
    title: "Clear Aligners in Bradford with Dr Attiya Ahmed",
    description: "A full £25 smile assessment, 3D scan and personalised clear-aligner or teeth-straightening plan at Nu Dentalign in Baildon, near Shipley and Bradford.",
    images: [{ url: "/images/attiya-portrait-highres.jpg", width: 1366, height: 2048, alt: "Dr Attiya Ahmed at Nu Dentalign in Baildon" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clear Aligners in Bradford with Dr Attiya Ahmed",
    description: "A full £25 smile assessment, 3D scan and personalised clear-aligner or teeth-straightening plan at Nu Dentalign in Baildon, near Shipley and Bradford.",
    images: ["/images/attiya-portrait-highres.jpg"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className="antialiased">{children}</body>
    </html>
  );
}
