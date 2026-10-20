"use client";

import CourseCard from "@/components/CourseCard";
import { useCollection } from "@/lib/useCollection";
import { courses as siteCourses } from "@/lib/site";
import type { Course } from "@/lib/site";

type CourseRow = {
  id: string;
  title?: string;
  category?: string;
  level?: string;
  duration?: string;
  description?: string;
  fee?: number;
  oldFee?: number;
  image?: string;
};

export default function BrowseCoursesPage() {
  const { rows } = useCollection<CourseRow>("courses", 100);

  // Firestore courses win; otherwise show the catalogue built into the website.
  const catalogue: Course[] =
    rows.length > 0
      ? rows.map((c) => ({
          title: c.title || "Untitled course",
          category: c.category || "",
          description: c.description || "",
          duration: c.duration || "",
          level: c.level || "",
          price: c.fee ? c.fee.toLocaleString("en-IN") : "",
          oldPrice: c.oldFee ? c.oldFee.toLocaleString("en-IN") : "",
          discount: "",
          image: c.image || "course-analytics",
        }))
      : siteCourses;

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">Browse courses</h1>
      <p className="mt-1 text-sm text-slate-600">
        Every course in the catalogue, with fees. Talk to us to enrol.
      </p>

      {/* The catalogue renders straight away and is replaced once Firestore answers. */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {catalogue.map((course) => (
          <CourseCard key={course.title} course={course} showPrice />
        ))}
      </div>
    </>
  );
}
