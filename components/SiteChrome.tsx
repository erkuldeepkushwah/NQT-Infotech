"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StudentShell from "@/components/StudentShell";
import AdminShell from "@/components/admin/AdminShell";
import { auth } from "@/lib/firebase";
import { isAdminEmail } from "@/lib/admin";

// The public navbar and footer wrap the marketing pages.
//
// Once somebody is signed in they are inside the product, so the marketing
// navbar is dropped and the dashboard chrome (top bar + sidebar) is shown
// instead - on every page. The dashboard and admin routes already render their
// own shell, so they are left alone.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  const standalone = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");
  if (standalone) {
    return <>{children}</>;
  }

  if (user) {
    return isAdminEmail(user.email) ? (
      <AdminShell>{children}</AdminShell>
    ) : (
      <StudentShell>{children}</StudentShell>
    );
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
