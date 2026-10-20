"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { isAdminEmail } from "@/lib/admin";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";

type NavItem = {
  label: string;
  href: string;
  icon: string;
  children?: { label: string; href: string }[];
};

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "grid" },
  {
    label: "Users",
    href: "/admin/users",
    icon: "users",
    children: [
      { label: "Add User", href: "/admin/users/new" },
      { label: "Manage Users", href: "/admin/users" },
    ],
  },
  { label: "Queries", href: "/admin/queries", icon: "mail" },
  {
    label: "Courses",
    href: "/admin/courses",
    icon: "layers",
    children: [
      { label: "Add Course", href: "/admin/courses/new" },
      { label: "Manage Courses", href: "/admin/courses" },
    ],
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: "cart",
    children: [
      { label: "Requests", href: "/admin/payments" },
      { label: "Payment Settings", href: "/admin/payments/settings" },
    ],
  },
  { label: "Profile", href: "/admin/profile", icon: "user" },
];

const PATHS: Record<string, string> = {
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M22 21a6 6 0 0 0-5-5.9",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  layers: "M12 3 3 8l9 5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5",
  cart: "M3 4h2l2.4 11h10.2L20 7H6M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
};

function NavIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
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

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [bell, setBell] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

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

  const path = (pathname || "").replace(/\/+$/, "") || "/";

  // Keep the group that owns the current page open.
  useEffect(() => {
    const owner = NAV.find(
      (item) => item.children && (path === item.href || path.startsWith(item.href + "/"))
    );
    setExpanded(owner ? owner.href : null);
  }, [path]);

  if (!isFirebaseConfigured) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-xl font-semibold text-navy-800">Admin is not configured</h1>
        <p className="mt-3 text-sm text-slate-600">Firebase is not set up yet. See the README.</p>
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
        <Link href="/login" className="btn-primary mt-7">Go to login</Link>
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

  function isActive(href: string) {
    if (href === "/admin") return path === "/admin";
    return path === href || path.startsWith(href + "/");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fixed top bar carrying the brand */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-[68px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 lg:hidden">
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
            <button type="button" aria-label="Notifications" onClick={() => setBell((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700">
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
              <span className="block text-xs text-slate-500">Enterprise Admin</span>
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
              {initials(displayName)}
            </span>
          </div>
        </div>
      </header>

      {/* Sidebar: fixed and full height, so it stays visible on every page */}
      <aside
        className={
          "fixed bottom-0 left-0 top-[68px] z-30 flex w-64 transform flex-col overflow-y-auto bg-navy-800 text-white transition-transform lg:translate-x-0 " +
          (open ? "translate-x-0" : "-translate-x-full")
        }
      >
        <nav className="flex flex-1 flex-col px-3 py-4">
          <div className="space-y-1">
            {NAV.map((item) => {
              const active = isActive(item.href);
              const isOpen = expanded === item.href;

              if (!item.children) {
                return (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                    className={"flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition " +
                      (active ? "bg-brand-600 text-white" : "text-brand-100 hover:bg-white/10 hover:text-white")}>
                    <NavIcon name={item.icon} className="h-[18px] w-[18px] flex-none" />
                    {item.label}
                  </Link>
                );
              }

              return (
                <div key={item.href}>
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : item.href)}
                    className={"flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition " +
                      (active ? "bg-brand-600 text-white" : "text-brand-100 hover:bg-white/10 hover:text-white")}
                  >
                    <NavIcon name={item.icon} className="h-[18px] w-[18px] flex-none" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2.5" className={isOpen ? "rotate-90 transition-transform" : "transition-transform"}
                      aria-hidden="true">
                      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {isOpen ? (
                    <div className="mt-1 space-y-1 border-l border-white/15 pl-4">
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href} onClick={() => setOpen(false)}
                          className={"block rounded-md px-3 py-2 text-[13px] transition " +
                            (path === child.href
                              ? "bg-white/15 font-semibold text-white"
                              : "text-brand-100 hover:bg-white/10 hover:text-white")}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <button type="button" onClick={() => auth && signOut(auth)}
            className="mt-auto flex items-center gap-3 rounded-md px-3 py-2.5 pt-8 text-left text-sm font-medium text-red-300 transition hover:bg-white/10 hover:text-red-200">
            <NavIcon name="logout" className="h-[18px] w-[18px] flex-none" />
            Logout
          </button>
        </nav>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
      ) : null}

      {/* Content sits beside the sidebar, so the footer never runs under it */}
      <div className="pt-[68px] lg:pl-64">
        <main className="min-h-[calc(100vh-68px)] bg-white px-5 py-7 sm:px-8">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
