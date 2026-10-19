"use client";

import { Panel, StatCard, TableShell, EmptyRow, StatusPill } from "@/components/admin/ui";
import { useCollection } from "@/lib/useCollection";
import { formatDate, type AdminPayment } from "@/lib/admin";

export default function AdminPaymentsPage() {
  const { rows, loading, error } = useCollection<AdminPayment>("payments", 200);

  const pending = rows.filter((p) => (p.status || "pending").toLowerCase() === "pending").length;
  const approved = rows.filter((p) => (p.status || "").toLowerCase() === "approved").length;
  const total = rows.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">Payments</h1>
      <p className="mt-1 text-sm text-slate-600">
        Course fee payments submitted by students.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending" value={loading ? "-" : pending} tone="brand" />
        <StatCard label="Approved" value={loading ? "-" : approved} tone="green" />
        <StatCard
          label="Total value"
          value={loading ? "-" : "₹" + total.toLocaleString("en-IN")}
          tone="slate"
        />
      </div>

      <Panel title={"Payment requests (" + rows.length + ")"}>
        <TableShell headers={["Student", "Course", "Amount", "Method", "UTR", "Date", "Status"]}>
          {loading ? (
            <EmptyRow colSpan={7} text="Loading payments..." />
          ) : error ? (
            <EmptyRow colSpan={7} text={error} />
          ) : rows.length === 0 ? (
            <EmptyRow colSpan={7} text="No payment requests yet." />
          ) : (
            rows.map((p) => (
              <tr key={p.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 font-medium text-navy-800">{p.studentName || "-"}</td>
                <td className="px-5 py-3 text-slate-600">{p.courseTitle || "-"}</td>
                <td className="px-5 py-3 text-slate-600">
                  {p.amount ? "₹" + p.amount.toLocaleString("en-IN") : "-"}
                </td>
                <td className="px-5 py-3 text-slate-600">{p.method || "-"}</td>
                <td className="px-5 py-3 text-slate-600">{p.utr || "-"}</td>
                <td className="px-5 py-3 text-slate-600">{formatDate(p.date)}</td>
                <td className="px-5 py-3">
                  <StatusPill status={p.status || "Pending"} />
                </td>
              </tr>
            ))
          )}
        </TableShell>
        <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
          Approving and rejecting requests comes with the student side in the next phase.
        </p>
      </Panel>
    </>
  );
}
