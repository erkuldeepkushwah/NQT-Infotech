import type { Metadata } from "next";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import CourseCard from "@/components/CourseCard";
import CTABand from "@/components/CTABand";
import SectionHeading from "@/components/SectionHeading";
import { courseBenefits, courses } from "@/lib/site";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Hands-on IT training courses from NQT Infotech: data analytics, data science, full stack web development and more.",
};

export default function CoursesPage() {
  return (
    <>
      <PageHero title="Courses" />

      <section className="section">
        <div className="container-x grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.title} course={course} />
          ))}
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Why learn with us"
              title="Why learn with NQT Infotech"
              subtitle="Our courses are taught by engineers who build these systems every day, so you learn what actually works in industry."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {courseBenefits.map((item) => (
              <div key={item} className="card flex items-start gap-3 p-5">
                <Icon name="check" className="mt-0.5 h-4 w-4 flex-none text-brand-600" />
                <span className="text-sm text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-20">
        <CTABand
          title="Not sure which course is right for you?"
          text="Talk to our team and we will recommend a learning path based on your background and goals."
          primary={{ href: "/contact", label: "Talk to an advisor" }}
          secondary={{ href: "/services", label: "See our services" }}
        />
      </section>
    </>
  );
}
