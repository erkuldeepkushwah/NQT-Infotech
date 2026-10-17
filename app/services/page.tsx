import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import ServiceCard from "@/components/ServiceCard";
import CTABand from "@/components/CTABand";
import SectionHeading from "@/components/SectionHeading";
import { img } from "@/lib/images";
import { process, services, techStack } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web development, mobile apps, cloud, custom software, UI/UX design and IT support from NQT Infotech.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero title="Our IT services" />

      <section className="section">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-x">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <img src={img("svc-g1", 640, 420)} alt="Project work" className="h-56 w-full rounded-xl object-cover" />
            <img src={img("svc-g2", 640, 420)} alt="Design review" className="h-56 w-full rounded-xl object-cover" />
            <img src={img("svc-g3", 640, 420)} alt="Development" className="h-56 w-full rounded-xl object-cover" />
            <img src={img("svc-g4", 640, 420)} alt="Team standup" className="h-56 w-full rounded-xl object-cover" />
            <img src={img("svc-g5", 640, 420)} alt="Client workshop" className="h-56 w-full rounded-xl object-cover" />
            <img src={img("svc-g6", 640, 420)} alt="Deployment" className="h-56 w-full rounded-xl object-cover" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid items-start gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">How we work</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy-800 sm:text-4xl">
              Trusted, client-focused approach
            </h2>
            <p className="mt-4 text-slate-600">
              We work closely with our clients to understand their technology
              goals and challenges. By combining experience, clear analysis and
              practical advice, we help businesses make confident decisions and
              achieve long-term, measurable results.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span key={tech} className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="card p-8">
            <h3 className="text-lg font-semibold text-navy-800">Engagement models</h3>
            <ul className="mt-5 space-y-4">
              {[
                { title: "Fixed scope", text: "Defined deliverables and a fixed price." },
                { title: "Time & material", text: "Flexible, billed for the work done." },
                { title: "Dedicated team", text: "A squad that works as an extension of yours." },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <Icon name="check" className="mt-0.5 h-4 w-4 flex-none text-brand-600" />
                  <div>
                    <div className="text-sm font-semibold text-navy-800">{item.title}</div>
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

      <section className="section bg-slate-50">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our consulting process"
            title="A clear, structured approach to technology projects"
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {process.map((step, index) => (
              <div key={step.title} className="card p-7">
                <div className="text-sm font-bold text-brand-600">{index + 1}.</div>
                <h3 className="mt-3 text-lg font-semibold text-navy-800">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
              </div>
            ))}
            <div className="relative isolate overflow-hidden rounded-xl banner-bg p-7">
              <h3 className="text-lg font-semibold text-white">Ready to get started?</h3>
              <p className="mt-2 text-sm text-brand-100">
                Schedule a consultation with our IT experts to discuss your goals.
              </p>
              <Link href="/contact" className="btn mt-6 bg-white text-brand-700 hover:bg-brand-50">
                Book a call
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-20">
        <CTABand
          title="Ready to build something great?"
          text="Tell us about your project and we will get back to you with a plan and an estimate within one working day."
          primary={{ href: "/contact", label: "Contact us" }}
          secondary={{ href: "/courses", label: "See our courses" }}
        />
      </section>
    </>
  );
}
