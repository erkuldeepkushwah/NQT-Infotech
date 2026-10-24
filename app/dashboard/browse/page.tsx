"use client";

import CourseCard from "@/components/CourseCard";
import { useRtdbList } from "@/lib/useRtdb";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { enrolledSlugs, useMyEnrollments } from "@/lib/enrollments";
import { slugify } from "@/lib/slug";
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
  const { rows } = useRtdbList<CourseRow>("courses");
  const { user } = useCurrentUser();
  const { rows: enrollments } = useMyEnrollments(user?.uid || "");

  // Courses the student already owns are not offered again.
  const owned = enrolledSlugs(enrollments);

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

  const available = catalogue.filter((c) => !owned.has(slugify(c.title)));

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">Browse courses</h1>
      <p className="mt-1 text-sm text-slate-600">
        Courses you can still enrol in. Ones you have already purchased are in My courses.
      </p>

      {available.length === 0 ? (
        <p className="mt-6 rounded-lg border border-slate-200 bg-white px-5 py-6 text-sm text-slate-600">
          You have purchased every course in the catalogue. Your courses are listed under
          My courses.
        </p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {available.map((course) => (
            <CourseCard key={course.title} course={course} showPrice />
          ))}
        </div>
      )}
    </>
  );
}
