"use client";

import Link from "next/link";
import { useState } from "react";

export type CourseDraft = {
  title: string;
  category: string;
  description: string;
  level: string;
  duration: string;
  fee: string;
  oldFee: string;
  image: string;
  status: string;
};

// The photos that ship with the website. A course can also point at its own
// image URL instead.
export const IMAGE_CHOICES = [
  { key: "course-analytics", label: "Data Analytics" },
  { key: "course-datascience", label: "Data Science" },
  { key: "course-fullstack", label: "Full stack" },
  { key: "course-python", label: "Python" },
  { key: "course-cloud", label: "Cloud & DevOps" },
  { key: "course-uiux", label: "UI / UX" },
];

export const LEVELS = ["Beginner", "Intermediate", "Advanced", "Beginner to Advanced"];

export function toNumber(value: string): number {
  return Number(String(value).replace(/[^0-9]/g, "")) || 0;
}

export const EMPTY_COURSE: CourseDraft = {
  title: "",
  category: "",
  description: "",
  level: "Beginner",
  duration: "",
  fee: "",
  oldFee: "",
  image: IMAGE_CHOICES[0].key,
  status: "Active",
};

export default function CourseForm({
  initial,
  submitLabel,
  onSubmit,
  busy,
  notice,
}: {
  initial: CourseDraft;
  submitLabel: string;
  onSubmit: (draft: CourseDraft) => void;
  busy: boolean;
  notice: string;
}) {
  const [draft, setDraft] = useState<CourseDraft>(initial);
  const [imageUrl, setImageUrl] = useState(
    /^https?:\/\//i.test(initial.image) ? initial.image : ""
  );

  function set<K extends keyof CourseDraft>(key: K, value: CourseDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit({ ...draft, image: imageUrl.trim() || draft.image });
  }

  return (
    <form onSubmit={submit} className="mt-6 max-w-3xl">
      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="grid gap-5 px-5 py-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="c-title" className="field-label block">
              Course title
            </label>
            <input
              id="c-title"
              required
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              className="field"
            />
          </div>

          <div>
            <label htmlFor="c-category" className="field-label block">
              Category
            </label>
            <input
              id="c-category"
              value={draft.category}
              onChange={(e) => set("category", e.target.value)}
              className="field"
            />
          </div>

          <div>
            <label htmlFor="c-level" className="field-label block">
              Level
            </label>
            <select
              id="c-level"
              value={draft.level}
              onChange={(e) => set("level", e.target.value)}
              className="field"
            >
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="c-duration" className="field-label block">
              Duration
            </label>
            <input
              id="c-duration"
              placeholder="e.g. 6 Months"
              value={draft.duration}
              onChange={(e) => set("duration", e.target.value)}
              className="field"
            />
          </div>

          <div>
            <label htmlFor="c-status" className="field-label block">
              Status
            </label>
            <select
              id="c-status"
              value={draft.status}
              onChange={(e) => set("status", e.target.value)}
              className="field"
            >
              <option>Active</option>
              <option>Draft</option>
            </select>
          </div>

          <div>
            <label htmlFor="c-fee" className="field-label block">
              Course fee (₹)
            </label>
            <input
              id="c-fee"
              inputMode="numeric"
              placeholder="e.g. 14999"
              value={draft.fee}
              onChange={(e) => set("fee", e.target.value)}
              className="field"
            />
          </div>

          <div>
            <label htmlFor="c-oldfee" className="field-label block">
              Original fee (₹) — optional
            </label>
            <input
              id="c-oldfee"
              inputMode="numeric"
              placeholder="e.g. 20000"
              value={draft.oldFee}
              onChange={(e) => set("oldFee", e.target.value)}
              className="field"
            />
          </div>

          <div>
            <label htmlFor="c-image" className="field-label block">
              Photo
            </label>
            <select
              id="c-image"
              value={/^https?:\/\//i.test(draft.image) ? "" : draft.image}
              onChange={(e) => set("image", e.target.value)}
              className="field"
            >
              {IMAGE_CHOICES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="c-image-url" className="field-label block">
              …or an image URL
            </label>
            <input
              id="c-image-url"
              placeholder="https://…"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="field"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="c-desc" className="field-label block">
              Short description
            </label>
            <textarea
              id="c-desc"
              rows={4}
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
              className="field"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 px-5 py-4">
          <button type="submit" disabled={busy} className="btn-primary px-5 py-2.5 disabled:opacity-60">
            {busy ? "Saving..." : submitLabel}
          </button>
          <Link href="/admin/courses" className="btn-ghost px-5 py-2.5">
            Cancel
          </Link>
          {notice ? <span className="text-sm text-slate-600">{notice}</span> : null}
        </div>
      </section>
    </form>
  );
}
