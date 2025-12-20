import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import Header from "../components/Header";
import { LanguageProvider } from "../components/LanguageProvider";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
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
      { url: "/logo1.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/logo1.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${dmSerif.variable} antialiased min-h-screen`}
        style={{
          background: "var(--bg-page)",
          color: "var(--text-primary)",
          fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
        }}
      >
        <LanguageProvider>
          <div className="sticky top-0 z-50">
            <Header />
          </div>
          <main>{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
