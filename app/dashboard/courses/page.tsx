"use client";

import Link from "next/link";
import { Panel, TableShell, EmptyRow, StatusPill } from "@/components/admin/ui";
import { useRtdbList } from "@/lib/useRtdb";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useMyEnrollments } from "@/lib/enrollments";
import { courses as siteCourses } from "@/lib/site";

type CourseRow = {
  id: string;
  title?: string;
  category?: string;
  level?: string;
  duration?: string;
  fee?: number;
};

function toNumber(value: string): number {
  return Number(String(value).replace(/[^0-9]/g, "")) || 0;
}

export default function MyCoursesPage() {
  const { user, ready } = useCurrentUser();
  const { rows: enrollments, loading: enrollLoading } = useMyEnrollments(user?.uid || "");
  const { rows: liveCourses } = useRtdbList<CourseRow>("courses");

  // Catalogue details, keyed by slug so an enrollment can be matched to a course.
  const catalogue = new Map<string, CourseRow>();
  for (const c of liveCourses) {
    catalogue.set(c.id, c);
  }
  for (const c of siteCourses) {
    const slug = c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (!catalogue.has(slug)) {
      catalogue.set(slug, {
        id: slug,
        title: c.title,
        category: c.category,
        level: c.level,
        duration: c.duration,
        fee: toNumber(c.price),
      });
    }
  }

  const purchased = enrollments.map((e) => {
    const detail = catalogue.get(e.id);
    return {
      id: e.id,
      title: e.courseTitle || detail?.title || "Course",
      category: detail?.category,
      level: detail?.level,
      duration: detail?.duration,
      amount: e.amount ?? detail?.fee,
      approvedAt: e.approvedAt,
    };
  });

  const loading = !ready || enrollLoading;

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">My courses</h1>
      <p className="mt-1 text-sm text-slate-600">
        The courses you have purchased. A course appears here once your payment is approved.
      </p>

      <Panel title={"Purchased courses (" + purchased.length + ")"}>
        <TableShell headers={["Course", "Category", "Level", "Duration", "Paid", "Status"]}>
          {loading ? (
            <EmptyRow colSpan={6} text="Loading your courses..." />
          ) : purchased.length === 0 ? (
            <EmptyRow
              colSpan={6}
              text="You have not purchased a course yet. Browse the catalogue and enrol to get started."
            />
          ) : (
            purchased.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 font-medium text-navy-800">{c.title}</td>
                <td className="px-5 py-3 text-slate-600">{c.category || "-"}</td>
                <td className="px-5 py-3 text-slate-600">{c.level || "-"}</td>
                <td className="px-5 py-3 text-slate-600">{c.duration || "-"}</td>
                <td className="px-5 py-3">
                  <span className="font-semibold text-navy-800">
                    {c.amount ? "₹" + c.amount.toLocaleString("en-IN") : "-"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <StatusPill status="Approved" />
                </td>
              </tr>
            ))
          )}
        </TableShell>
        {!loading && purchased.length === 0 ? (
          <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            <Link href="/dashboard/browse" className="font-medium text-brand-600 hover:underline">
              Browse courses →
            </Link>
          </p>
        ) : null}
      </Panel>
    </>
  );
}
