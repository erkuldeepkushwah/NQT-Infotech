"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Panel, TableShell, EmptyRow, StatusPill } from "@/components/admin/ui";
import { useCollection } from "@/lib/useCollection";
import { db } from "@/lib/firebase";
import { courses as siteCourses } from "@/lib/site";
import type { AdminCourse } from "@/lib/admin";

function toNumber(value: string): number {
  return Number(String(value).replace(/[^0-9]/g, "")) || 0;
}

export default function AdminCoursesPage() {
  const { rows, loading, error } = useCollection<AdminCourse>("courses", 200);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  async function importCourses() {
    if (!db) return;
    setBusy(true);
    setNotice("");
    try {
      for (const c of siteCourses) {
        await addDoc(collection(db, "courses"), {
          title: c.title,
          category: c.category,
          level: c.level,
          duration: c.duration,
          fee: toNumber(c.price),
          oldFee: toNumber(c.oldPrice),
          status: "Active",
          createdAt: serverTimestamp(),
        });
      }
      setNotice("Imported. Reloading...");
      window.location.reload();
    } catch {
      setNotice("Could not import. Check that the Firestore rules allow admin writes.");
    } finally {
      setBusy(false);
    }
  }

  const usingFallback = !loading && !error && rows.length === 0;

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">Courses</h1>
      <p className="mt-1 text-sm text-slate-600">
        The training courses listed on the website.
      </p>

      <Panel
        title={"Manage courses (" + (usingFallback ? siteCourses.length : rows.length) + ")"}
        action={
          usingFallback ? (
            <button
              type="button"
              onClick={importCourses}
              disabled={busy}
              className="btn-primary px-4 py-2 text-sm disabled:opacity-60"
            >
              {busy ? "Importing..." : "Import website courses"}
            </button>
          ) : null
        }
      >
        <TableShell headers={["Course", "Category", "Fee", "Duration", "Status"]}>
          {loading ? (
            <EmptyRow colSpan={5} text="Loading courses..." />
          ) : error ? (
            <EmptyRow colSpan={5} text={error} />
          ) : usingFallback ? (
            siteCourses.map((c) => (
              <tr key={c.title} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3">
                  <span className="font-medium text-navy-800">{c.title}</span>
                  <span className="block text-xs text-slate-500">{c.level}</span>
                </td>
                <td className="px-5 py-3 text-slate-600">{c.category}</td>
                <td className="px-5 py-3 font-medium text-navy-800">₹{toNumber(c.price).toLocaleString("en-IN")}</td>
                <td className="px-5 py-3 text-slate-600">{c.duration}</td>
                <td className="px-5 py-3">
                  <StatusPill status="Active" />
                </td>
              </tr>
            ))
          ) : (
            rows.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3">
                  <span className="font-medium text-navy-800">{c.title || "-"}</span>
                  <span className="block text-xs text-slate-500">{c.level || ""}</span>
                </td>
                <td className="px-5 py-3 text-slate-600">{c.category || "-"}</td>
                <td className="px-5 py-3 font-medium text-navy-800">
                  {c.fee ? "₹" + c.fee.toLocaleString("en-IN") : "-"}
                </td>
                <td className="px-5 py-3 text-slate-600">{c.duration || "-"}</td>
                <td className="px-5 py-3">
                  <StatusPill status={c.status || "Active"} />
                </td>
              </tr>
            ))
          )}
        </TableShell>

        {notice ? (
          <p className="border-t border-slate-100 px-5 py-3 text-sm text-brand-700">{notice}</p>
        ) : null}
        {usingFallback ? (
          <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            These are the courses built into the website. Import them to store and edit
            them in Firestore.
          </p>
        ) : null}
      </Panel>
    </>
  );
}
