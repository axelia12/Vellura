import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-8FJ4CPBT8R";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vellura — Strategic Communications",
    template: "%s — Vellura",
  },
  description:
    "Vellura works with brands, founders and institutions navigating reputation, influence and long-term positioning.",
  openGraph: {
    title: "Vellura — Strategic Communications",
    description:
      "Vellura works with brands, founders and institutions navigating reputation, influence and long-term positioning.",
    url: siteUrl,
    siteName: "Vellura",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vellura — Strategic Communications",
    description:
      "Vellura works with brands, founders and institutions navigating reputation, influence and long-term positioning.",
  },
  robots: { index: true, follow: true },
  verification: {
    google: "-3Roe1fkUIKH_ILVIUje9lXSqfbd9Z3pUNYMa6-wGBU",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Vellura",
  url: siteUrl,
  description:
    "Vellura works with brands, founders and institutions navigating reputation, influence and long-term positioning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-8FJ4CPBT8R"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-8FJ4CPBT8R');
</script>
      <body className="min-h-full flex flex-col bg-noir text-ivory">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
