"use client";

import CourseCard from "@/components/CourseCard";
import { useRtdbList } from "@/lib/useRtdb";
import { courses as siteCourses, type Course } from "@/lib/site";

type Row = {
  id: string;
  title?: string;
  category?: string;
  description?: string;
  level?: string;
  duration?: string;
  fee?: number;
  oldFee?: number;
  image?: string;
  status?: string;
};

function discountOf(fee?: number, oldFee?: number): string {
  if (!fee || !oldFee || oldFee <= fee) return "";
  return Math.round(((oldFee - fee) / oldFee) * 100) + "% OFF";
}

/**
 * The course catalogue. Courses are fetched from the Realtime Database so
 * anything the admin publishes appears here; until that answers (or if it is
 * empty) the courses built into the website are shown.
 */
export default function CourseGrid() {
  const { rows } = useRtdbList<Row>("courses");

  const live = rows.filter((r) => (r.status || "Active").toLowerCase() !== "draft");

  const list: Course[] = live.length
    ? live.map((c) => ({
        title: c.title || "Untitled course",
        category: c.category || "",
        description: c.description || "",
        duration: c.duration || "",
        level: c.level || "",
        price: c.fee ? c.fee.toLocaleString("en-IN") : "",
        oldPrice: c.oldFee ? c.oldFee.toLocaleString("en-IN") : "",
        discount: discountOf(c.fee, c.oldFee),
        image: c.image || "course-analytics",
      }))
    : siteCourses;

  return (
    <div className="container-x grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((course) => (
        <CourseCard key={course.title} course={course} />
      ))}
    </div>
  );
}
