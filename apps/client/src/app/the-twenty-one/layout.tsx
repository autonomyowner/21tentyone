import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Twenty One | Premium Creative Studio",
  description: "Where artistry meets intention. A premium creative agency crafting unforgettable brand experiences through art direction, design, and strategic vision.",
  keywords: [
    "creative agency",
    "brand design",
    "art direction",
    "premium design studio",
    "luxury branding",
    "creative studio",
    "visual identity",
    "brand experience"
  ],
  openGraph: {
    title: "The Twenty One | Premium Creative Studio",
    description: "Where artistry meets intention. Crafting unforgettable experiences.",
    type: "website",
  },
};

export default function TheTwentyOneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="the-twenty-one-wrapper">
      {/* Hide default header with CSS */}
      <style>{`
        .the-twenty-one-wrapper {
          position: relative;
        }
        /* Hide the sticky header for this page */
        .sticky.top-0.z-50 {
          display: none !important;
        }
      `}</style>
      {children}
    </div>
  );
}
