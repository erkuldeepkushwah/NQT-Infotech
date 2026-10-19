"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { isAdminEmail } from "@/lib/admin";
import Logo from "@/components/Logo";

type NavItem = {
  label: string;
  href: string;
  icon: string;
  children?: { label: string; href: string }[];
};

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "chart" },
  { label: "Users", href: "/admin/users", icon: "users" },
  { label: "Queries", href: "/admin/queries", icon: "mail" },
  { label: "Courses", href: "/admin/courses", icon: "layers" },
  { label: "Payments", href: "/admin/payments", icon: "cart" },
  { label: "Profile", href: "/admin/profile", icon: "users" },
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

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

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
        <h1 className="text-xl font-semibold text-navy-800">Admin is not configured</h1>
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
          The admin area is only available to signed-in administrators.
        </p>
        <Link href="/login" className="btn-primary mt-7">
          Go to login
        </Link>
      </div>
    );
  }

  if (!isAdminEmail(user.email)) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-xl font-semibold text-navy-800">Access denied</h1>
        <p className="mt-3 text-sm text-slate-600">
          {user.email} is not an administrator for this site.
        </p>
        <button type="button" onClick={() => auth && signOut(auth)} className="btn-ghost mt-7">
          Sign out
        </button>
      </div>
    );
  }

  const displayName = user.displayName || user.email || "Admin";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={
            "fixed inset-y-0 left-0 z-40 w-64 transform bg-navy-800 text-white transition-transform lg:static lg:translate-x-0 " +
            (open ? "translate-x-0" : "-translate-x-full")
          }
        >
          <div className="flex h-[68px] items-center px-6">
            <span className="text-base font-extrabold tracking-tight text-white">
              NQT<span className="font-medium text-brand-300"> Admin</span>
            </span>
          </div>

          <nav className="mt-2 space-y-1 px-3 pb-24">
            {NAV.map((item) => {
              const active =
                item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition " +
                      (active
                        ? "bg-brand-600 text-white"
                        : "text-brand-100 hover:bg-white/10 hover:text-white")
                    }
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                    {item.label}
                  </Link>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => auth && signOut(auth)}
              className="mt-4 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-brand-100 transition hover:bg-white/10 hover:text-white"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
              Log out
            </button>
          </nav>
        </aside>

        {open ? (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        ) : null}

        {/* Main */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
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
            <div className="hidden lg:block" />
            <div className="flex items-center gap-3">
              <span className="text-right text-sm leading-tight">
                <span className="block font-semibold text-navy-800">{displayName}</span>
                <span className="block text-xs text-slate-500">Enterprise Admin</span>
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {initials(displayName)}
              </span>
            </div>
          </header>

          <main className="px-5 py-7 sm:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
