import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: site.name + " | " + site.tagline,
    template: "%s | " + site.name,
  },
  description: site.description,
  keywords: [
    "Brivora",
    "IT services",
    "software development",
    "web development",
    "cloud solutions",
    "IT training",
    "Indore",
  ],
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
