"use client";

import Link from "next/link";
import { Panel, TableShell, EmptyRow } from "@/components/admin/ui";
import { useCollection } from "@/lib/useCollection";
import { courses as siteCourses } from "@/lib/site";

type Course = {
  id: string;
  title: string;
  category?: string;
  level?: string;
  duration?: string;
  fee?: number;
  oldFee?: number;
};

function toNumber(value: string): number {
  return Number(String(value).replace(/[^0-9]/g, "")) || 0;
}

export default function MyCoursesPage() {
  const { rows, loading, error } = useCollection<Course>("courses", 100);

  // Fall back to the courses built into the website so the catalogue is never
  // empty for a signed-in student.
  const courses: Course[] =
    rows.length > 0
      ? rows.map((c) => ({
          id: c.id,
          title: c.title || "Untitled course",
          category: c.category,
          level: c.level,
          duration: c.duration,
          fee: c.fee,
          oldFee: c.oldFee,
        }))
      : siteCourses.map((c) => ({
          id: "site-" + c.title,
          title: c.title,
          category: c.category,
          level: c.level,
          duration: c.duration,
          fee: toNumber(c.price),
          oldFee: toNumber(c.oldPrice),
        }));

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">My courses</h1>
      <p className="mt-1 text-sm text-slate-600">
        The courses you can enrol in, with fees. Progress tracking arrives with the next
        phase.
      </p>

      <Panel title={"Course catalogue (" + courses.length + ")"}>
        <TableShell headers={["Course", "Category", "Level", "Duration", "Fee", ""]}>
          {loading ? (
            <EmptyRow colSpan={6} text="Loading courses..." />
          ) : error ? (
            <EmptyRow colSpan={6} text={error} />
          ) : (
            courses.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 font-medium text-navy-800">{c.title}</td>
                <td className="px-5 py-3 text-slate-600">{c.category || "-"}</td>
                <td className="px-5 py-3 text-slate-600">{c.level || "-"}</td>
                <td className="px-5 py-3 text-slate-600">{c.duration || "-"}</td>
                <td className="px-5 py-3">
                  <span className="font-semibold text-navy-800">
                    {c.fee ? "₹" + c.fee.toLocaleString("en-IN") : "-"}
                  </span>
                  {c.oldFee ? (
                    <span className="ml-2 text-xs text-slate-400 line-through">
                      ₹{c.oldFee.toLocaleString("en-IN")}
                    </span>
                  ) : null}
                </td>
                <td className="px-5 py-3">
                  <Link
                    href="/contact"
                    className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-300 hover:text-brand-700"
                  >
                    Enquire
                  </Link>
                </td>
              </tr>
            ))
          )}
        </TableShell>
      </Panel>
    </>
  );
}
