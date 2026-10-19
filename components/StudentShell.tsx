"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { isAdminEmail } from "@/lib/admin";
import Logo from "@/components/Logo";

const NAV = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Courses", href: "/dashboard/courses" },
  { label: "Browse Courses", href: "/courses" },
  { label: "Profile", href: "/dashboard/profile" },
];

function initials(name: string): string {
  return name
    .split(/[\s@.]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function StudentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [bell, setBell] = useState(false);

  useEffect(() => {
    if (!auth) {
      setReady(true);
      return;
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
  }, []);

  if (!isFirebaseConfigured) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-xl font-semibold text-navy-800">Not configured yet</h1>
        <p className="mt-3 text-sm text-slate-600">
          Firebase is not set up yet. See the README for the setup steps.
        </p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center text-sm text-slate-500">
        Checking your session...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-xl font-semibold text-navy-800">Sign in to continue</h1>
        <p className="mt-3 text-sm text-slate-600">
          Your learning dashboard is available once you sign in.
        </p>
        <Link href="/login" className="btn-primary mt-7">
          Go to login
        </Link>
      </div>
    );
  }

  const displayName = user.displayName || user.email || "Student";
  // Static export serves /dashboard/ with a trailing slash; normalise so the
  // active nav item is still highlighted.
  const path = (pathname || "").replace(/\/+$/, "") || "/";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Full-width white top bar carrying the brand */}
      <header className="sticky top-0 z-40 flex h-[68px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 lg:hidden"
          >
            <span className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-slate-700" />
              <span className="block h-0.5 w-5 bg-slate-700" />
              <span className="block h-0.5 w-5 bg-slate-700" />
            </span>
          </button>
          <Logo />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setBell((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.7 21a2 2 0 0 1-3.4 0" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {bell ? (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-lg">
                You have no new notifications.
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-right text-sm leading-tight sm:block">
              <span className="block font-semibold text-navy-800">{displayName}</span>
              <span className="block text-xs text-slate-500">User</span>
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
              {initials(displayName)}
            </span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Dark sidebar, sitting below the top bar */}
        <aside
          className={
            "fixed bottom-0 left-0 top-[68px] z-30 w-64 transform overflow-y-auto bg-navy-800 text-white transition-transform lg:static lg:translate-x-0 " +
            (open ? "translate-x-0" : "-translate-x-full")
          }
        >
          <nav className="py-5">
            <p className="px-6 pb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">
              Main learning
            </p>
            <div className="space-y-1 px-3">
              {NAV.map((item) => {
                const active = path === item.href || path.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={
                      "block rounded-md px-3 py-2.5 text-sm font-medium transition " +
                      (active
                        ? "bg-brand-600 text-white"
                        : "text-brand-100 hover:bg-white/10 hover:text-white")
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}

              {isAdminEmail(user.email) ? (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="block rounded-md border border-brand-400/40 px-3 py-2.5 text-sm font-medium text-brand-100 transition hover:bg-white/10 hover:text-white"
                >
                  Admin panel
                </Link>
              ) : null}
            </div>

            <div className="mt-6 px-3">
              <button
                type="button"
                onClick={() => auth && signOut(auth)}
                className="block w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-brand-100 transition hover:bg-white/10 hover:text-white"
              >
                Logout
              </button>
            </div>
          </nav>
        </aside>

        {open ? (
          <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
        ) : null}

        <main className="min-w-0 flex-1 px-5 py-7 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
