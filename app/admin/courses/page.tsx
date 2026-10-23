"use client";

import Link from "next/link";
import { useState } from "react";
import { addDoc, collection, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { Panel, TableShell, EmptyRow, StatusPill } from "@/components/admin/ui";
import { useCollection } from "@/lib/useCollection";
import { db } from "@/lib/firebase";
import { img } from "@/lib/images";
import { courses as siteCourses } from "@/lib/site";
import type { AdminCourse } from "@/lib/admin";
import { toNumber } from "@/components/admin/CourseForm";

export default function AdminCoursesPage() {
  const { rows, loading, error } = useCollection<AdminCourse>("courses", 200);
  const [removed, setRemoved] = useState<string[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const visible = rows.filter((r) => !removed.includes(r.id));
  const usingFallback = !loading && !error && rows.length === 0;
  const count = usingFallback ? siteCourses.length : visible.length;

  async function importCourses() {
    if (!db) return;
    setBusy(true);
    setNotice("");
    try {
      for (const c of siteCourses) {
        await addDoc(collection(db, "courses"), {
          title: c.title,
          category: c.category,
          description: c.description,
          level: c.level,
          duration: c.duration,
          fee: toNumber(c.price),
          oldFee: toNumber(c.oldPrice),
          image: c.image,
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

  async function remove(course: AdminCourse) {
    if (!db) {
      setNotice("Firebase is not configured, so courses cannot be removed.");
      return;
    }
    const ok = window.confirm(
      "Delete " + (course.title || "this course") + "? This cannot be undone."
    );
    if (!ok) return;

    setBusyId(course.id);
    setNotice("");
    try {
      await deleteDoc(doc(db, "courses", course.id));
      setRemoved((prev) => [...prev, course.id]);
      setNotice("Course deleted.");
    } catch {
      setNotice("Could not delete this course. Check that you are signed in as an admin.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Courses</h1>
          <p className="mt-1 text-sm text-slate-600">
            Add courses, and edit or delete the ones already in the catalogue.
          </p>
        </div>
        <Link href="/admin/courses/new" className="btn-primary px-5 py-2.5">
          + Add course
        </Link>
      </div>

      {notice ? (
        <p className="mt-4 rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-700">{notice}</p>
      ) : null}

      <Panel
        title={"Manage courses (" + count + ")"}
        action={
          usingFallback ? (
            <button
              type="button"
              onClick={importCourses}
              disabled={busy}
              className="btn-ghost px-4 py-2 text-sm disabled:opacity-60"
            >
              {busy ? "Importing..." : "Import website courses"}
            </button>
          ) : null
        }
      >
        <TableShell headers={["Course", "Category", "Fee", "Duration", "Status", ""]}>
          {loading ? (
            <EmptyRow colSpan={6} text="Loading courses..." />
          ) : error ? (
            <EmptyRow colSpan={6} text={error} />
          ) : usingFallback ? (
            siteCourses.map((c) => (
              <tr key={c.title} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={img(c.image, 64, 40)}
                      alt=""
                      className="h-10 w-16 flex-none rounded object-cover"
                    />
                    <span>
                      <span className="font-medium text-navy-800">{c.title}</span>
                      <span className="block text-xs text-slate-500">{c.level}</span>
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600">{c.category}</td>
                <td className="px-5 py-3 font-medium text-navy-800">
                  ₹{toNumber(c.price).toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-3 text-slate-600">{c.duration}</td>
                <td className="px-5 py-3">
                  <StatusPill status="Active" />
                </td>
                <td className="px-5 py-3 text-xs text-slate-400">Built-in</td>
              </tr>
            ))
          ) : visible.length === 0 ? (
            <EmptyRow
              colSpan={6}
              text="No courses yet. Use “Add course” to publish the first one."
            />
          ) : (
            visible.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={img(c.image || "course-analytics", 64, 40)}
                      alt=""
                      className="h-10 w-16 flex-none rounded object-cover"
                    />
                    <span>
                      <span className="font-medium text-navy-800">{c.title || "-"}</span>
                      <span className="block text-xs text-slate-500">{c.level || ""}</span>
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600">{c.category || "-"}</td>
                <td className="px-5 py-3">
                  <span className="font-medium text-navy-800">
                    {c.fee ? "₹" + c.fee.toLocaleString("en-IN") : "-"}
                  </span>
                  {c.oldFee ? (
                    <span className="ml-2 text-xs text-slate-400 line-through">
                      ₹{c.oldFee.toLocaleString("en-IN")}
                    </span>
                  ) : null}
                </td>
                <td className="px-5 py-3 text-slate-600">{c.duration || "-"}</td>
                <td className="px-5 py-3">
                  <StatusPill status={c.status || "Active"} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={"/admin/courses/edit?id=" + c.id}
                      className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-300 hover:text-brand-700"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(c)}
                      disabled={busyId === c.id}
                      className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      {busyId === c.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </TableShell>

        {usingFallback ? (
          <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            These courses are built into the website, so they cannot be edited here yet.
            Import them to store and manage them in Firestore.
          </p>
        ) : null}
      </Panel>
    </>
  );
}
