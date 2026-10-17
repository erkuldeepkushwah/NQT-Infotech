import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import { site, stats, values } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about NQT Infotech - an IT services company helping businesses build reliable digital products.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-slate-100 bg-gradient-to-b from-brand-50 to-white">
        <div className="container-x py-16 sm:py-20">
          <span className="eyebrow">About us</span>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            We build technology that businesses depend on
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            {site.name} is a team of engineers, designers and problem-solvers
            helping organisations turn ideas into reliable digital products.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Our story</h2>
            <div className="mt-4 space-y-4 text-slate-600">
              <p>
                NQT Infotech started with a simple belief: good software should
                be practical, dependable and built around the people who use it.
                What began as a small development team has grown into a full IT
                services partner.
              </p>
              <p>
                Today we work with startups, small businesses and enterprises
                across India and beyond, delivering web platforms, mobile apps,
                cloud infrastructure and custom software.
              </p>
              <p>
                We stay deliberately hands-on. The people who scope your project
                are the same people who build it, which keeps communication
                short and quality high.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6"
              >
                <div className="text-3xl font-extrabold gradient-text">
                  {item.value}
                </div>
                <div className="mt-2 text-sm text-slate-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-x">
          <span className="eyebrow">Our values</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            What guides our work
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="card">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name={value.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x">
          <div className="rounded-3xl bg-brand-900 px-8 py-14 text-center sm:px-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Let us work together
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-100">
              Whether you need a new product or help with an existing one, we
              would love to hear about it.
            </p>
            <Link href="/contact" className="btn mt-8 bg-white text-brand-800 hover:bg-brand-50">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
