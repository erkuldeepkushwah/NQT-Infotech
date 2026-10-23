"use client";

import { useState } from "react";
import { ref, update as rtdbUpdate } from "firebase/database";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Panel, StatCard, TableShell, EmptyRow, StatusPill } from "@/components/admin/ui";
import { useRtdbList } from "@/lib/useRtdb";
import { useCollection } from "@/lib/useCollection";
import { formatDate, type AdminPayment, type DateLike } from "@/lib/admin";
import { db, rtdb } from "@/lib/firebase";

type Row = AdminPayment & { source: "rtdb" | "firestore" };

function stamp(value: DateLike): number {
  if (!value) return 0;
  if (typeof value === "number") return value;
  return value.toDate?.()?.getTime() ?? 0;
}

export default function AdminPaymentsPage() {
  // Payments go to the Realtime Database, with Firestore as a fallback - read both.
  const live = useRtdbList<AdminPayment>("payments");
  const backup = useCollection<AdminPayment>("payments", 200);

  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const loading = live.loading && backup.loading;
  const error = live.error && backup.error ? live.error : "";

  const seen = new Set<string>();
  const rows: Row[] = [];
  for (const [list, source] of [
    [live.rows, "rtdb"],
    [backup.rows, "firestore"],
  ] as const) {
    for (const p of list) {
      const key = [p.utr || "", p.courseTitle || "", p.amount || 0, p.studentEmail || ""].join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({ ...p, source });
    }
  }
  rows.sort((a, b) => stamp(b.date) - stamp(a.date));

  const statusOf = (p: Row) => overrides[p.source + "-" + p.id] ?? p.status ?? "Pending";
  const pending = rows.filter((p) => statusOf(p).toLowerCase() === "pending").length;
  const approved = rows.filter((p) => statusOf(p).toLowerCase() === "approved").length;
  const rejected = rows.filter((p) => statusOf(p).toLowerCase() === "rejected").length;
  const total = rows
    .filter((p) => statusOf(p).toLowerCase() === "approved")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  async function mark(p: Row, next: "Approved" | "Rejected") {
    if (next === "Rejected") {
      const ok = window.confirm(
        "Mark the request from " + (p.studentName || "this student") + " as failed?"
      );
      if (!ok) return;
    }
    setBusyId(p.id);
    setNotice("");
    try {
      if (p.source === "rtdb") {
        if (!rtdb) throw new Error("no rtdb");
        await rtdbUpdate(ref(rtdb, "payments/" + p.id), {
          status: next,
          reviewedAt: Date.now(),
        });
      } else {
        if (!db) throw new Error("no firestore");
        await updateDoc(doc(db, "payments", p.id), { status: next, reviewedAt: serverTimestamp() });
      }
      setOverrides((o) => ({ ...o, [p.source + "-" + p.id]: next }));
      setNotice("Request marked " + next.toLowerCase() + ".");
    } catch {
      setNotice("Could not update the request. Check that you are signed in as an admin.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">Payments</h1>
      <p className="mt-1 text-sm text-slate-600">
        Course fee payments submitted by students. Approve a request to confirm it, or mark
        it failed if the payment did not arrive.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="Pending" value={loading ? "-" : pending} tone="brand" />
        <StatCard label="Approved" value={loading ? "-" : approved} tone="green" />
        <StatCard label="Failed" value={loading ? "-" : rejected} tone="slate" />
        <StatCard
          label="Approved value"
          value={loading ? "-" : "₹" + total.toLocaleString("en-IN")}
          tone="slate"
        />
      </div>

      {notice ? (
        <p className="mt-4 rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-700">{notice}</p>
      ) : null}

      <Panel title={"Payment requests (" + rows.length + ")"}>
        <TableShell
          headers={["Student", "Course", "Amount", "Method", "UTR", "Date", "Status", ""]}
        >
          {loading ? (
            <EmptyRow colSpan={8} text="Loading payments..." />
          ) : error ? (
            <EmptyRow colSpan={8} text={error} />
          ) : rows.length === 0 ? (
            <EmptyRow
              colSpan={8}
              text="No payment requests yet. They appear here as soon as a student submits one from the checkout page."
            />
          ) : (
            rows.map((p) => {
              const status = statusOf(p);
              const low = status.toLowerCase();
              return (
                <tr key={p.source + "-" + p.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3 font-medium text-navy-800">{p.studentName || "-"}</td>
                  <td className="px-5 py-3 text-slate-600">{p.courseTitle || "-"}</td>
                  <td className="px-5 py-3 text-slate-600">
                    {p.amount ? "₹" + p.amount.toLocaleString("en-IN") : "-"}
                  </td>
                  <td className="px-5 py-3 text-slate-600">{p.method || "-"}</td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-600">{p.utr || "-"}</td>
                  <td className="px-5 py-3 text-slate-600">{formatDate(p.date)}</td>
                  <td className="px-5 py-3">
                    <StatusPill status={status} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => mark(p, "Approved")}
                        disabled={busyId === p.id || low === "approved"}
                        className="rounded-md border border-green-200 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50 disabled:opacity-40"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => mark(p, "Rejected")}
                        disabled={busyId === p.id || low === "rejected"}
                        className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-40"
                      >
                        Fail
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </TableShell>
        <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
          Approving confirms the payment; failing marks it as not received.
        </p>
      </Panel>
    </>
  );
}
