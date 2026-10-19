"use client";

import { Fragment, useState } from "react";
import { Panel, TableShell, EmptyRow } from "@/components/admin/ui";
import { useCollection } from "@/lib/useCollection";
import { formatDate, type AdminEnquiry } from "@/lib/admin";

export default function AdminQueriesPage() {
  const { rows, loading, error } = useCollection<AdminEnquiry>("enquiries", 200);
  const [openId, setOpenId] = useState<string | null>(null);

  const sorted = [...rows].sort((a, b) => {
    const at = a.createdAt?.toDate?.()?.getTime() ?? 0;
    const bt = b.createdAt?.toDate?.()?.getTime() ?? 0;
    return bt - at;
  });

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">Contact queries</h1>
      <p className="mt-1 text-sm text-slate-600">
        Every enquiry submitted through the contact form on the website.
      </p>

      <Panel title={"All queries (" + rows.length + ")"}>
        <TableShell headers={["Name", "Email", "Phone", "Company", "Received", ""]}>
          {loading ? (
            <EmptyRow colSpan={6} text="Loading queries..." />
          ) : error ? (
            <EmptyRow colSpan={6} text={error} />
          ) : sorted.length === 0 ? (
            <EmptyRow
              colSpan={6}
              text="No enquiries yet. They appear here as soon as someone submits the contact form."
            />
          ) : (
            sorted.map((q) => (
              <Fragment key={q.id}>
                <tr className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3 font-medium text-navy-800">{q.name || "-"}</td>
                  <td className="px-5 py-3 text-slate-600">{q.email || "-"}</td>
                  <td className="px-5 py-3 text-slate-600">{q.phone || "-"}</td>
                  <td className="px-5 py-3 text-slate-600">{q.company || "-"}</td>
                  <td className="px-5 py-3 text-slate-600">{formatDate(q.createdAt)}</td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => setOpenId(openId === q.id ? null : q.id)}
                      className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-300 hover:text-brand-700"
                    >
                      {openId === q.id ? "Hide" : "Read"}
                    </button>
                  </td>
                </tr>
                {openId === q.id ? (
                  <tr className="border-b border-slate-50 bg-slate-50">
                    <td colSpan={6} className="px-5 py-4 text-sm text-slate-700">
                      {q.message || "(no message)"}
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))
          )}
        </TableShell>
      </Panel>
    </>
  );
}
