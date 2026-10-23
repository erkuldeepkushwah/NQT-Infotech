"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { get, ref, serverTimestamp as rtdbTimestamp, update } from "firebase/database";
import CourseForm, { EMPTY_COURSE, toNumber, type CourseDraft } from "@/components/admin/CourseForm";
import { rtdb } from "@/lib/firebase";

function EditCourse() {
  const params = useSearchParams();
  const id = params.get("id") || "";
  const [initial, setInitial] = useState<CourseDraft | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!rtdb || !id) {
      setNotice("No course selected.");
      return;
    }
    (async () => {
      try {
        const snap = await get(ref(rtdb, "courses/" + id));
        if (!snap.exists()) {
          setNotice("That course no longer exists.");
          return;
        }
        const d = (snap.val() || {}) as Record<string, unknown>;
        setInitial({
          title: String(d.title || ""),
          category: String(d.category || ""),
          description: String(d.description || ""),
          level: String(d.level || "Beginner"),
          duration: String(d.duration || ""),
          fee: d.fee ? String(d.fee) : "",
          oldFee: d.oldFee ? String(d.oldFee) : "",
          image: String(d.image || EMPTY_COURSE.image),
          status: String(d.status || "Active"),
        });
      } catch {
        setNotice("Could not load the course. Check that you are signed in as an admin.");
      }
    })();
  }, [id]);

  async function save(draft: CourseDraft) {
    if (!rtdb || !id) return;
    setBusy(true);
    setNotice("");
    try {
      await update(ref(rtdb, "courses/" + id), {
        title: draft.title.trim(),
        category: draft.category.trim(),
        description: draft.description.trim(),
        level: draft.level,
        duration: draft.duration.trim(),
        fee: toNumber(draft.fee),
        oldFee: toNumber(draft.oldFee),
        image: draft.image,
        status: draft.status,
        updatedAt: rtdbTimestamp(),
      });
      window.location.assign((process.env.NEXT_PUBLIC_BASE_PATH || "") + "/admin/courses/");
    } catch {
      setNotice("Could not save the changes. Check that you are signed in as an admin.");
      setBusy(false);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">Edit course</h1>
      <p className="mt-1 text-sm text-slate-600">Update the details shown on the website.</p>

      {notice && !initial ? (
        <p className="mt-6 rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-700">{notice}</p>
      ) : null}

      {initial ? (
        <CourseForm
          initial={initial}
          submitLabel="Save changes"
          onSubmit={save}
          busy={busy}
          notice={notice}
        />
      ) : null}
    </>
  );
}

export default function EditCoursePage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading course...</p>}>
      <EditCourse />
    </Suspense>
  );
}
