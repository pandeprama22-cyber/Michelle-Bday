import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteContent } from "@/config/content";
import "./globals.css";

// Self-hosted fonts (not next/font/google) so the build never depends on
// reaching fonts.googleapis.com at build time — it previously failed in
// any network-restricted environment (corporate proxy, offline CI, this
// sandbox) even though the code itself had no bug. Files are the exact
// same open-source font files Google Fonts serves, just bundled locally.
const greatVibes = localFont({
  src: "./fonts/GreatVibes-Regular.ttf",
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
});

const playfairDisplay = localFont({
  src: [
    { path: "./fonts/PlayfairDisplay-Variable.ttf", style: "normal" },
    { path: "./fonts/PlayfairDisplay-Italic-Variable.ttf", style: "italic" },
  ],
  variable: "--font-playfair-display",
  display: "swap",
});

const poppins = localFont({
  src: [
    { path: "./fonts/Poppins-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Poppins-SemiBold.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://love-gift.vercel.app"),
  title: siteContent.ogTitle,
  description: siteContent.ogDescription,
  openGraph: {
    title: siteContent.ogTitle,
    description: siteContent.ogDescription,
    images: [
      {
        url: siteContent.ogImage,
        width: 1200,
        height: 630,
        alt: siteContent.ogTitle,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteContent.ogTitle,
    description: siteContent.ogDescription,
    images: [siteContent.ogImage],
  },
  other: {
    "theme-color": "#0a0a14",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${greatVibes.variable} ${playfairDisplay.variable} ${poppins.variable} h-full antialiased`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-full bg-navy-deep text-cream overflow-x-hidden"
            style={{ fontFamily: 'var(--font-body)' }}>
        {children}
      </body>
    </html>
  );
}
