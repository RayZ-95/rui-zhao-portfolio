import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export const metadata: Metadata = {
  title: {
    default: "Rui Zhao | Academic Portfolio",
    template: "%s | Rui Zhao"
  },
  description:
    "Academic portfolio of Rui Zhao, Ph.D. candidate researching digital fashion marketing, AI in fashion education, and cultural heritage design.",
  metadataBase: new URL("https://rui-zhao-academic-portfolio.local"),
  openGraph: {
    title: "Rui Zhao | Academic Portfolio",
    description:
      "Research, design, teaching, publications, and CV for Rui Zhao, Ph.D. candidate in Textiles, Apparel Design and Merchandising.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
