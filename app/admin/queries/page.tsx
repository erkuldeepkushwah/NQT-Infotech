"use client";

import { Fragment, useState } from "react";
import { ref, remove } from "firebase/database";
import { deleteDoc, doc } from "firebase/firestore";
import { Panel, TableShell, EmptyRow } from "@/components/admin/ui";
import { useRtdbList } from "@/lib/useRtdb";
import { useCollection } from "@/lib/useCollection";
import { db, rtdb } from "@/lib/firebase";
import type { DateLike } from "@/lib/admin";

type Enquiry = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  createdAt?: DateLike;
};

type Row = Enquiry & { source: "rtdb" | "firestore" };

function stamp(value: DateLike): number {
  if (!value) return 0;
  if (typeof value === "number") return value;
  return value.toDate?.()?.getTime() ?? 0;
}

function when(value: DateLike): string {
  const ms = stamp(value);
  if (!ms) return "-";
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminQueriesPage() {
  // Enquiries are written to the Realtime Database, but the form falls back to
  // Firestore if the database is unreachable - so read both and merge.
  const live = useRtdbList<Enquiry>("enquiries");
  const backup = useCollection<Enquiry>("enquiries", 200);

  const [openId, setOpenId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const loading = live.loading && backup.loading;
  const error = live.error && backup.error ? live.error : "";

  const seen = new Set<string>();
  const merged: Row[] = [];
  for (const [list, source] of [
    [live.rows, "rtdb"],
    [backup.rows, "firestore"],
  ] as const) {
    for (const e of list) {
      const key = [e.email || "", e.message || "", e.name || ""].join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push({ ...e, source });
    }
  }

  const sorted = merged.sort((a, b) => stamp(b.createdAt) - stamp(a.createdAt));

  async function drop(row: Row) {
    const ok = window.confirm(
      "Delete the query from " + (row.name || "this sender") + "? This cannot be undone."
    );
    if (!ok) return;

    setBusyId(row.id);
    setNotice("");
    try {
      if (row.source === "rtdb" && rtdb) {
        await remove(ref(rtdb, "enquiries/" + row.id));
      } else if (db) {
        await deleteDoc(doc(db, "enquiries", row.id));
      }
      if (openId === row.id) setOpenId(null);
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
        Every enquiry submitted through the contact form, newest first.
      </p>

      {notice ? (
        <p className="mt-4 rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-700">{notice}</p>
      ) : null}

      {live.error && !live.loading ? (
        <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-xs text-amber-800">
          Realtime Database: {live.error}
        </p>
      ) : null}

      <Panel title={"All queries (" + merged.length + ")"}>
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
              <Fragment key={q.source + "-" + q.id}>
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
                        onClick={() => drop(q)}
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
