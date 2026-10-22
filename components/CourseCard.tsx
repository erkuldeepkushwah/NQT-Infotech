"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { img } from "@/lib/images";
import { auth } from "@/lib/firebase";
import type { Course } from "@/lib/site";

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Prices are only shown to signed-in visitors; everyone else is invited to log
// in. (This hides the price from the page - see the README for the caveat.)
export default function CourseCard({
  course,
  showPrice,
}: {
  course: Course;
  // Inside the dashboard the visitor is already signed in, so prices are forced on.
  showPrice?: boolean;
}) {
  const [signedIn, setSignedIn] = useState(Boolean(showPrice));

  useEffect(() => {
    if (showPrice || !auth) return;
    return onAuthStateChanged(auth, (user) => setSignedIn(Boolean(user)));
  }, [showPrice]);

  // Signed-in visitors stay inside the dashboard; everyone else gets the public page.
  const inDashboard = signedIn || showPrice;
  const detailsHref = inDashboard ? "/dashboard/browse" : "/courses";
  const enrollHref = inDashboard
    ? "/dashboard/checkout?course=" + slugify(course.title)
    : "/contact";

  return (
    <article className="card flex flex-col overflow-hidden">
      <div className="aspect-[16/9] overflow-hidden bg-slate-100">
        <img
          src={img(course.image, 640, 360)}
          alt={course.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-navy-800">{course.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{course.description}</p>

        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            {course.category}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
            <span>Duration: {course.duration}</span>
            <span>Level: {course.level}</span>
          </div>
        </div>

        <div className="mt-4 flex min-h-[30px] flex-wrap items-baseline gap-2">
          {signedIn || showPrice ? (
            <>
              <span className="text-xl font-extrabold text-navy-800">&#8377;{course.price}</span>
              <span className="text-sm text-slate-400 line-through">
                &#8377;{course.oldPrice}
              </span>
              <span className="rounded bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                {course.discount}
              </span>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold text-brand-600 hover:underline"
            >
              Log in to view pricing
            </Link>
          )}
        </div>

        <div className="mt-5 flex gap-3">
          <Link href={detailsHref} className="btn-ghost flex-1 py-2.5">
            View Details
          </Link>
          <Link href={enrollHref} className="btn-primary flex-1 py-2.5">
            Enroll Now
          </Link>
        </div>
      </div>
    </article>
  );
}
