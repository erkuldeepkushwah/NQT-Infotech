"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import Logo from "@/components/Logo";
import { navLinks } from "@/lib/site";
import { auth } from "@/lib/firebase";
import { isAdminEmail } from "@/lib/admin";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  const signedIn = Boolean(user);
  const showAdmin = isAdminEmail(user?.email);

  // Once signed in, Courses opens inside the dashboard so the public chrome
  // (and the Login button) never appears to a logged-in user.
  const links = navLinks.map((link) =>
    signedIn && link.href === "/courses" ? { ...link, href: "/dashboard/browse" } : link
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <nav className="container-x flex h-[68px] items-center justify-between">
        <Logo />

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={
                  "text-sm font-medium transition hover:text-brand-600 " +
                  (active ? "text-brand-600" : "text-slate-900")
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {showAdmin ? (
            <Link
              href="/admin"
              className="rounded-md border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
            >
              Admin
            </Link>
          ) : null}
          {signedIn ? null : (
            <Link href="/login" className="btn-primary px-6 py-2.5">
              Login
            </Link>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 lg:hidden"
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-slate-800" />
            <span className="block h-0.5 w-5 bg-slate-800" />
            <span className="block h-0.5 w-5 bg-slate-800" />
          </div>
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}

            {showAdmin ? (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="rounded-md border border-brand-200 bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700"
              >
                Admin panel
              </Link>
            ) : null}
            {signedIn ? null : (
              <Link href="/login" onClick={() => setOpen(false)} className="btn-primary mt-2">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
