"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useCollection } from "@/lib/useCollection";

type Enrollment = {
  id: string;
  courseTitle?: string;
  category?: string;
  progress?: number;
  status?: string;
  lessonsCompleted?: number;
  lessonsTotal?: number;
  duration?: string;
  enrolledAt?: { toDate?: () => Date } | null;
};

type Tab = "all" | "progress" | "completed";

function enrolDate(value: Enrollment["enrolledAt"]): string {
  const d = value && typeof value.toDate === "function" ? value.toDate() : null;
  if (!d) return "-";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function Ring({ value }: { value: number }) {
  const r = 20;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className="flex-none">
      <circle cx="28" cy="28" r={r} fill="none" stroke="#E2E8F0" strokeWidth="6" />
      <circle
        cx="28"
        cy="28"
        r={r}
        fill="none"
        stroke="#0B4FE0"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (clamped / 100) * c}
        transform="rotate(-90 28 28)"
      />
      <text x="28" y="32" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0A1740">
        {clamped}%
      </text>
    </svg>
  );
}

export default function StudentDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>("all");
  const { rows, loading } = useCollection<Enrollment>("enrollments", 50);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  const name = user?.displayName || (user?.email || "").split("@")[0] || "there";

  const completed = rows.filter((r) => (r.status || "").toLowerCase() === "completed");
  const inProgress = rows.filter((r) => (r.status || "in progress").toLowerCase() !== "completed");
  const avg =
    rows.length > 0 ? Math.round(rows.reduce((s, r) => s + (r.progress || 0), 0) / rows.length) : 0;

  const current = inProgress[0] || rows[0];
  const remaining = current
    ? Math.max(0, (current.lessonsTotal || 0) - (current.lessonsCompleted || 0))
    : 0;
  const totalUnits = rows.reduce((s, r) => s + (r.lessonsTotal || 0), 0);
  const doneUnits = rows.reduce((s, r) => s + (r.lessonsCompleted || 0), 0);

  const shown = tab === "completed" ? completed : tab === "progress" ? inProgress : rows;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all", label: "All Courses", count: rows.length },
    { key: "progress", label: "In Progress", count: inProgress.length },
    { key: "completed", label: "Completed", count: completed.length },
  ];

  return (
    <>
      {/* Learning track banner */}
      <section className="relative isolate overflow-hidden rounded-xl bg-gradient-to-r from-[#0A0F2C] via-[#0B2E86] to-[#1668F5] px-6 py-7 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Active Learning Track &middot; Enterprise Cohort
          </span>
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-brand-100">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            Resume last lesson
            <span className="font-medium normal-case text-white/75">{avg}% Completed</span>
          </span>
        </div>

        <h1 className="mt-6 text-3xl font-bold text-white sm:text-[32px]">
          Welcome back, {name}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-brand-100">
          Continue where you left off in your IT certification track.
          {remaining > 0
            ? " You have " + remaining + " lessons remaining in this course."
            : " Your enrolled courses and progress all live here."}
        </p>
        {current?.courseTitle ? (
          <p className="mt-4 text-sm font-semibold text-white">{current.courseTitle}</p>
        ) : null}
        <Link
          href="/dashboard/courses"
          className="btn mt-5 bg-white text-brand-700 hover:bg-brand-50"
        >
          Continue Learning
        </Link>
      </section>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Stat label="Total enrolled" value={loading ? "-" : rows.length} hint="Enrolled programs" />
        <Stat label="In progress" value={loading ? "-" : inProgress.length} hint="Active study phase" />
        <Stat label="Completed" value={loading ? "-" : completed.length} hint="100% finished" />
        <Stat label="Certificates" value={loading ? "-" : completed.length} hint="Verified & Issued" />
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Total progress
            </p>
            <p className="mt-2 text-xs text-slate-500">
              {doneUnits}/{totalUnits} Units
            </p>
          </div>
          <Ring value={loading ? 0 : avg} />
        </div>
      </div>

      {/* My courses */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-navy-800">My Courses</h2>
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={
                "rounded-md border px-4 py-2 text-sm font-semibold transition " +
                (tab === t.key
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700")
              }
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-slate-500">Loading your courses...</p>
      ) : shown.length === 0 ? (
        <div className="mt-6 rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-600">
            You are not enrolled in a course yet. Browse the catalogue to get started.
          </p>
          <Link href="/courses" className="btn-primary mt-5">
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((e) => {
            const pct = Math.min(100, Math.max(0, e.progress || 0));
            const done = (e.status || "").toLowerCase() === "completed";
            return (
              <div key={e.id} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={
                      "rounded px-2 py-0.5 text-[11px] font-semibold " +
                      (done ? "bg-green-50 text-green-700" : "bg-green-50 text-green-700")
                    }
                  >
                    {done ? "Completed" : e.status || "In Progress"}
                  </span>
                  {e.category ? (
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                      {e.category}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-3 text-base font-bold text-navy-800">
                  {e.courseTitle || "Untitled course"}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Duration: {e.duration || "-"} &nbsp;&nbsp; Enrolled: {enrolDate(e.enrolledAt)}
                </p>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{pct}%</span>
                  <span>
                    {e.lessonsCompleted || 0}/{e.lessonsTotal || 0} lessons completed
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-brand-600" style={{ width: pct + "%" }} />
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href="/dashboard/courses" className="btn-primary px-4 py-2 text-sm">
                    Continue Learning
                  </Link>
                  <Link href="/dashboard/courses" className="btn-ghost px-3 py-2 text-sm">
                    View Course
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function Stat({ label, value, hint }: { label: string; value: React.ReactNode; hint: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-navy-800">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  );
}
