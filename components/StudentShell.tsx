"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { isAdminEmail } from "@/lib/admin";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";

type NavItem = { label: string; href: string; icon: string };

const MAIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "grid" },
  { label: "My Courses", href: "/dashboard/courses", icon: "book" },
  { label: "Browse Courses", href: "/courses", icon: "compass" },
  { label: "Expert", href: "/dashboard/expert", icon: "star" },
  { label: "Certificates", href: "/dashboard/certificates", icon: "award" },
  { label: "Assignments", href: "/dashboard/assignments", icon: "clipboard" },
  { label: "Quizzes", href: "/dashboard/quizzes", icon: "quiz" },
];

const ACCOUNT_NAV: NavItem[] = [
  { label: "Profile", href: "/dashboard/profile", icon: "user" },
  { label: "Settings", href: "/dashboard/settings", icon: "gear" },
];

const PATHS: Record<string, string> = {
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  book: "M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2zM18 16H7",
  compass: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
  award: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.5 13.5 7 21l5-3 5 3-1.5-7.5",
  clipboard: "M9 4h6v3H9zM7 5H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-1",
  quiz: "M9 5h6M5 9h14M5 14h9M5 19h6",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7.5 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3.6 14H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 7.5l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 3.6V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.5 1.5l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
};

function NavIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[name] || PATHS.grid} />
    </svg>
  );
}

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
  const path = (pathname || "").replace(/\/+$/, "") || "/";

  function isActive(href: string) {
    if (href === "/courses") return path === "/courses";
    return path === href || path.startsWith(href + "/");
  }

  function navLink(item: NavItem) {
    const active = isActive(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setOpen(false)}
        className={
          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition " +
          (active ? "bg-brand-600 text-white" : "text-brand-100 hover:bg-white/10 hover:text-white")
        }
      >
        <NavIcon name={item.icon} className="h-[18px] w-[18px] flex-none" />
        {item.label}
      </Link>
    );
  }

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
            "fixed bottom-0 left-0 top-[68px] z-30 flex w-64 transform flex-col overflow-y-auto bg-navy-800 text-white transition-transform lg:static lg:translate-x-0 " +
            (open ? "translate-x-0" : "-translate-x-full")
          }
        >
          <nav className="flex flex-1 flex-col px-3 py-5">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">
              Main learning
            </p>
            <div className="space-y-1">{MAIN_NAV.map(navLink)}</div>

            {isAdminEmail(user.email) ? (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center gap-3 rounded-md border border-brand-400/40 px-3 py-2.5 text-sm font-medium text-brand-100 transition hover:bg-white/10 hover:text-white"
              >
                <NavIcon name="grid" className="h-[18px] w-[18px] flex-none" />
                Admin panel
              </Link>
            ) : null}

            <p className="px-3 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">
              Account
            </p>
            <div className="space-y-1">{ACCOUNT_NAV.map(navLink)}</div>

            <button
              type="button"
              onClick={() => auth && signOut(auth)}
              className="mt-auto flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-red-300 transition hover:bg-white/10 hover:text-red-200"
            >
              <NavIcon name="logout" className="h-[18px] w-[18px] flex-none" />
              Logout
            </button>
          </nav>
        </aside>

        {open ? (
          <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
        ) : null}

        <main className="min-w-0 flex-1 bg-white px-5 py-7 sm:px-8">{children}</main>
      </div>

      <Footer />
    </div>
  );
}
