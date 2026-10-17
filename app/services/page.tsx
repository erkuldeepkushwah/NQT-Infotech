import type { Metadata } from "next";
import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import { process, services, techStack } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web development, mobile apps, cloud, custom software, UI/UX design and IT support from NQT Infotech.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-slate-100 bg-gradient-to-b from-brand-50 to-white">
        <div className="container-x py-16 sm:py-20">
          <span className="eyebrow">Services</span>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Technology services built around your goals
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            Pick a single service or let us handle the whole product lifecycle.
            Every engagement is scoped clearly and delivered on schedule.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow">Our toolkit</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Modern, proven technologies
            </h2>
            <p className="mt-4 text-slate-600">
              We choose stable, well-supported tools so your product stays
              maintainable and easy to hire for.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">
            <h3 className="text-lg font-semibold text-slate-900">
              Engagement models
            </h3>
            <ul className="mt-5 space-y-4">
              {[
                { title: "Fixed scope", text: "Defined deliverables and a fixed price." },
                { title: "Time & material", text: "Flexible, billed for the work done." },
                { title: "Dedicated team", text: "A squad that works as an extension of yours." },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-accent-500" />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {item.title}
                    </div>
                    <div className="text-sm text-slate-600">{item.text}</div>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn-primary mt-8">
              Request a proposal
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x">
          <div className="max-w-2xl">
            <span className="eyebrow">Process</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              How every project runs
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step) => (
              <div key={step.step} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6">
                <div className="text-sm font-bold text-brand-600">{step.step}</div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
