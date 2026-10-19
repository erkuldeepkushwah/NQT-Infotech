"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// The public navbar and footer wrap the marketing pages. The admin area and the
// student dashboard are standalone apps, so they render without them.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
