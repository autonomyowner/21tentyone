import type { Metadata } from "next";
import { Poppins, Inter, Cairo, Cormorant_Garamond, Outfit } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ConditionalHeader } from "../components/ConditionalHeader";
import { LanguageProvider } from "../components/LanguageProvider";
import { ConvexClientProvider } from "../lib/convex";
import { T21Chatbot } from "../components/T21Chatbot";
import "./globals.css";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  preload: false,
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "21|Twenty One - Heal Your Attachment, Build Healthy Relationships",
    template: "%s | 21|Twenty One",
  },
  description:
    "A 21-day program designed to help you understand your attachment style, heal emotional wounds, and build secure, fulfilling relationships. Start your healing journey today.",
  keywords: [
    "attachment healing",
    "attachment style",
    "relationship healing",
    "secure attachment",
    "anxious attachment",
    "avoidant attachment",
    "emotional healing",
    "21 day program",
    "relationship therapy",
    "inner child healing",
    "self-love",
    "healthy relationships",
  ],
  authors: [{ name: "21|Twenty One" }],
  creator: "21|Twenty One",
  publisher: "21|Twenty One",
  metadataBase: new URL("https://21twentyone.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "21|Twenty One - Heal Your Attachment, Build Healthy Relationships",
    description:
      "A 21-day program to understand your attachment style, heal emotional wounds, and build secure, fulfilling relationships.",
    type: "website",
    locale: "en_US",
    url: "https://21twentyone.com",
    siteName: "21|Twenty One",
  },
  twitter: {
    card: "summary_large_image",
    title: "21|Twenty One - Heal Your Attachment",
    description:
      "A 21-day healing journey to build secure, fulfilling relationships.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/brand-logo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/brand-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        {GA_MEASUREMENT_ID && (
          <>
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="preconnect" href="https://www.google-analytics.com" />
          </>
        )}
      </head>
      <body
        className={`${poppins.variable} ${inter.variable} ${cairo.variable} ${cormorantGaramond.variable} ${outfit.variable} antialiased min-h-screen`}
        style={{
          background: "var(--bg-page)",
          color: "var(--text-primary)",
          fontFamily: "var(--font-inter), var(--font-cairo), system-ui, sans-serif",
        }}
      >
        <ConvexClientProvider>
          <LanguageProvider>
            <ConditionalHeader />
            <main>{children}</main>
            <T21Chatbot />
          </LanguageProvider>
        </ConvexClientProvider>
        {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
      </body>
    </html>
  );
}
