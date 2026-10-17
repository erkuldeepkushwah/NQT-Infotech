import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import Icon from "@/components/Icon";
import { process, services, site, stats, values } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-white to-white" />
        <div className="container-x grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3 py-1 text-xs font-semibold text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
              IT Services &amp; Software Solutions
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Build faster with <span className="gradient-text">NQT Infotech</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {site.description} From idea to launch, we design, build and
              maintain digital products that help your business grow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Start a project
              </Link>
              <Link href="/services" className="btn-ghost">
                Explore services
              </Link>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-6">
              {stats.slice(0, 3).map((item) => (
                <div key={item.label}>
                  <div className="text-2xl font-bold text-slate-900">
                    {item.value}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">
                  Delivery dashboard
                </span>
                <span className="rounded-full bg-accent-50 px-2.5 py-1 text-xs font-medium text-accent-600">
                  On track
                </span>
              </div>
              <div className="mt-5 space-y-4">
                {[
                  { label: "Discovery & planning", value: "100%" },
                  { label: "UI/UX design", value: "85%" },
                  { label: "Development", value: "62%" },
                  { label: "Testing & launch", value: "30%" },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{row.label}</span>
                      <span>{row.value}</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-accent-400"
                        style={{ width: row.value }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Sprint velocity</div>
                  <div className="text-lg font-bold text-slate-900">+24%</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Bugs open</div>
                  <div className="text-lg font-bold text-slate-900">3</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="max-w-2xl">
            <span className="eyebrow">What we do</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              End-to-end IT services under one roof
            </h2>
            <p className="mt-4 text-slate-600">
              Whatever stage your business is at, we have the team and the tools
              to design, build and run the technology behind it.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="section bg-slate-50">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow">Why NQT Infotech</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              A technology partner you can rely on
            </h2>
            <p className="mt-4 text-slate-600">
              We combine engineering discipline with a genuinely collaborative
              way of working, so you always know what is being built and why.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {values.map((value) => (
                <div key={value.title} className="flex gap-3">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm">
                    <Icon name={value.icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {value.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm"
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

      {/* Process */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="max-w-2xl">
            <span className="eyebrow">How we work</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              A clear process from idea to launch
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

      {/* CTA */}
      <section className="pb-20">
        <div className="container-x">
          <div className="overflow-hidden rounded-3xl bg-brand-900 px-8 py-14 text-center sm:px-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to build something great?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-100">
              Tell us about your project and we will get back to you with a plan
              and an estimate within one working day.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn bg-white text-brand-800 hover:bg-brand-50">
                Contact us
              </Link>
              <Link href="/services" className="btn border border-brand-700 text-white hover:bg-brand-800">
                See our services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
