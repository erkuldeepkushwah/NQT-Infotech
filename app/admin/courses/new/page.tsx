"use client";

import { useState } from "react";
import { push, ref, serverTimestamp as rtdbTimestamp, set } from "firebase/database";
import CourseForm, { EMPTY_COURSE, toNumber, type CourseDraft } from "@/components/admin/CourseForm";
import { rtdb } from "@/lib/firebase";

export default function AddCoursePage() {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  async function save(draft: CourseDraft) {
    if (!rtdb) {
      setNotice("Realtime Database is not configured.");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      await set(push(ref(rtdb, "courses")), {
        title: draft.title.trim(),
        category: draft.category.trim(),
        description: draft.description.trim(),
        level: draft.level,
        duration: draft.duration.trim(),
        fee: toNumber(draft.fee),
        oldFee: toNumber(draft.oldFee),
        image: draft.image,
        status: draft.status,
        createdAt: rtdbTimestamp(),
      });
      window.location.assign((process.env.NEXT_PUBLIC_BASE_PATH || "") + "/admin/courses/");
    } catch {
      setNotice("Could not save the course. Check that you are signed in as an admin.");
      setBusy(false);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">Add course</h1>
      <p className="mt-1 text-sm text-slate-600">
        Publish a new training course to the catalogue.
      </p>
      <CourseForm
        initial={EMPTY_COURSE}
        submitLabel="Add course"
        onSubmit={save}
        busy={busy}
        notice={notice}
      />
    </>
  );
}
