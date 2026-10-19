"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { Panel, StatCard, TableShell, EmptyRow } from "@/components/admin/ui";
import { auth } from "@/lib/firebase";
import { useCollection } from "@/lib/useCollection";

type Enrollment = {
  id: string;
  courseTitle?: string;
  progress?: number;
  status?: string;
  lessonsCompleted?: number;
  lessonsTotal?: number;
};

export default function StudentDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const { rows, loading } = useCollection<Enrollment>("enrollments", 50);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  const name = user?.displayName || (user?.email || "").split("@")[0] || "there";
  const mine = rows.filter((r) => (r.status || "in progress").toLowerCase() !== "completed");
  const completed = rows.filter((r) => (r.status || "").toLowerCase() === "completed");
  const avg =
    rows.length > 0
      ? Math.round(rows.reduce((s, r) => s + (r.progress || 0), 0) / rows.length)
      : 0;

  return (
    <>
      <section className="relative isolate overflow-hidden rounded-xl banner-bg px-8 py-10">
        <div className="pointer-events-none absolute -right-24 -top-32 -z-10 h-[360px] w-[480px] rounded-full bg-brand-500/40 blur-3xl" />
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
          Active learning track
        </span>
        <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          Welcome back, {name}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-brand-100">
          Continue where you left off. Your enrolled courses, progress and certificates
          all live here.
        </p>
        <Link href="/courses" className="btn mt-7 bg-white text-brand-700 hover:bg-brand-50">
          Browse courses
        </Link>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Enrolled" value={loading ? "-" : rows.length} tone="brand" />
        <StatCard label="In progress" value={loading ? "-" : mine.length} tone="brand" />
        <StatCard label="Completed" value={loading ? "-" : completed.length} tone="green" />
        <StatCard label="Total progress" value={loading ? "-" : avg + "%"} tone="slate" />
      </div>

      <Panel
        title="My courses"
        action={
          <Link href="/dashboard/courses" className="text-sm font-semibold text-brand-600 hover:underline">
            View all
          </Link>
        }
      >
        <TableShell headers={["Course", "Progress", "Lessons", "Status"]}>
          {loading ? (
            <EmptyRow colSpan={4} text="Loading your courses..." />
          ) : rows.length === 0 ? (
            <EmptyRow
              colSpan={4}
              text="You are not enrolled in a course yet. Browse the course catalogue to get started."
            />
          ) : (
            rows.slice(0, 5).map((r) => (
              <tr key={r.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 font-medium text-navy-800">{r.courseTitle || "-"}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-32 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-brand-500"
                        style={{ width: Math.min(100, Math.max(0, r.progress || 0)) + "%" }}
                      />
                    </div>
                    <span className="text-xs text-slate-600">{r.progress || 0}%</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {r.lessonsCompleted || 0} / {r.lessonsTotal || 0}
                </td>
                <td className="px-5 py-3 text-slate-600">{r.status || "In progress"}</td>
              </tr>
            ))
          )}
        </TableShell>
        <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
          Enrolments appear here once the student side is connected to the course
          catalogue.
        </p>
      </Panel>
    </>
  );
}
