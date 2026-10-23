"use client";

import { Fragment, useState } from "react";
import { ref, remove } from "firebase/database";
import { Panel, TableShell, EmptyRow } from "@/components/admin/ui";
import { useRtdbList } from "@/lib/useRtdb";
import { rtdb } from "@/lib/firebase";

type Enquiry = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  createdAt?: number | { toDate?: () => Date } | null;
};

function when(value: Enquiry["createdAt"]): string {
  if (!value) return "-";
  const date =
    typeof value === "number"
      ? new Date(value)
      : typeof value.toDate === "function"
        ? value.toDate()
        : null;
  if (!date) return "-";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminQueriesPage() {
  const { rows, loading, error } = useRtdbList<Enquiry>("enquiries");
  const [openId, setOpenId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const sorted = [...rows].sort((a, b) => {
    const at = typeof a.createdAt === "number" ? a.createdAt : 0;
    const bt = typeof b.createdAt === "number" ? b.createdAt : 0;
    return bt - at;
  });

  async function drop(id: string, name: string) {
    if (!rtdb) {
      setNotice("Realtime Database is not configured, so queries cannot be removed.");
      return;
    }
    const ok = window.confirm(
      "Delete the query from " + (name || "this sender") + "? This cannot be undone."
    );
    if (!ok) return;

    setBusyId(id);
    setNotice("");
    try {
      await remove(ref(rtdb, "enquiries/" + id));
      if (openId === id) setOpenId(null);
      setNotice("Query deleted.");
    } catch {
      setNotice("Could not delete this query. Check that you are signed in as an admin.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">Contact queries</h1>
      <p className="mt-1 text-sm text-slate-600">
        Every enquiry submitted through the contact form. Stored in the Realtime
        Database, and updated live.
      </p>

      {notice ? (
        <p className="mt-4 rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-700">{notice}</p>
      ) : null}

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
                  <td className="px-5 py-3 text-slate-600">{when(q.createdAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setOpenId(openId === q.id ? null : q.id)}
                        className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-300 hover:text-brand-700"
                      >
                        {openId === q.id ? "Hide" : "Read"}
                      </button>
                      <button
                        type="button"
                        onClick={() => drop(q.id, q.name || "")}
                        disabled={busyId === q.id}
                        className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                      >
                        {busyId === q.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
                {openId === q.id ? (
                  <tr className="border-b border-slate-50 bg-slate-50">
                    <td colSpan={6} className="px-5 py-4 text-sm text-slate-700">
                      <p className="whitespace-pre-wrap">{q.message || "(no message)"}</p>
                      <p className="mt-3 text-xs text-slate-500">
                        Reply to{" "}
                        <a
                          href={"mailto:" + (q.email || "")}
                          className="font-medium text-brand-600 hover:underline"
                        >
                          {q.email || "-"}
                        </a>
                        {q.phone ? " · " + q.phone : ""}
                      </p>
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
