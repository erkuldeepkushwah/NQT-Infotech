"use client";

import Link from "next/link";
import { Panel, TableShell, EmptyRow } from "@/components/admin/ui";
import { useCollection } from "@/lib/useCollection";

type Course = {
  id: string;
  title?: string;
  category?: string;
  level?: string;
  duration?: string;
  fee?: number;
};

export default function MyCoursesPage() {
  const { rows, loading, error } = useCollection<Course>("courses", 100);

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">My courses</h1>
      <p className="mt-1 text-sm text-slate-600">
        The courses you can enrol in. Progress tracking arrives with the next phase.
      </p>

      <Panel title={"Course catalogue (" + rows.length + ")"}>
        <TableShell headers={["Course", "Category", "Level", "Duration", "Fee", ""]}>
          {loading ? (
            <EmptyRow colSpan={6} text="Loading courses..." />
          ) : error ? (
            <EmptyRow colSpan={6} text={error} />
          ) : rows.length === 0 ? (
            <EmptyRow
              colSpan={6}
              text="No courses are published yet. Please check back soon."
            />
          ) : (
            rows.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 font-medium text-navy-800">{c.title || "-"}</td>
                <td className="px-5 py-3 text-slate-600">{c.category || "-"}</td>
                <td className="px-5 py-3 text-slate-600">{c.level || "-"}</td>
                <td className="px-5 py-3 text-slate-600">{c.duration || "-"}</td>
                <td className="px-5 py-3 text-slate-600">
                  {c.fee ? "₹" + c.fee.toLocaleString("en-IN") : "-"}
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
