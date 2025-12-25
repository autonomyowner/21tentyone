import type { Metadata } from "next";
import { Poppins, Inter, Cairo } from "next/font/google";
import Header from "../components/Header";
import { LanguageProvider } from "../components/LanguageProvider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  display: "swap",
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
      { url: "/brand-logo.jpg", sizes: "192x192", type: "image/jpeg" },
    ],
    apple: "/brand-logo.jpg",
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
        className={`${poppins.variable} ${inter.variable} ${cairo.variable} antialiased min-h-screen`}
        style={{
          background: "var(--bg-page)",
          color: "var(--text-primary)",
          fontFamily: "var(--font-inter), var(--font-cairo), system-ui, sans-serif",
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
