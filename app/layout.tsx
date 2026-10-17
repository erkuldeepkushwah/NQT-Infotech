import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: site.name + " | IT Services & Software Solutions",
    template: "%s | " + site.name,
  },
  description: site.description,
  keywords: [
    "NQT Infotech",
    "IT services",
    "software development",
    "web development",
    "cloud solutions",
    "India",
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
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
