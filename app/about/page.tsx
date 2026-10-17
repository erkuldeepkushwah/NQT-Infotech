import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import StatStrip from "@/components/StatStrip";
import TeamCard from "@/components/TeamCard";
import CTABand from "@/components/CTABand";
import SectionHeading from "@/components/SectionHeading";
import { img } from "@/lib/images";
import { milestones, philosophy, site, stats, team, whyUsBullets } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "NQT Infotech is an IT services company helping businesses build reliable digital products.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero title="About our company" />

      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <img src={img("about-a", 480, 560)} alt="Team at work" className="h-full w-full rounded-xl object-cover" />
            <img src={img("about-b", 480, 560)} alt="Office collaboration" className="mt-8 h-full w-full rounded-xl object-cover" />
          </div>
          <div>
            <span className="eyebrow">Who we are</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy-800 sm:text-4xl">
              We help businesses grow with smart technology solutions
            </h2>
            <p className="mt-4 text-slate-600">
              Our company helps businesses handle growth, change and challenges
              with practical technology. We combine experience with a genuinely
              consultative way of working so every solution fits the people who
              use it.
            </p>
            <p className="mt-4 text-slate-600">
              We value clear, open communication and long-term partnerships.
              Every project is planned to give you an easy-to-use, more
              efficient system that performs well and moves your business
              forward.
            </p>
            <Link href="/services" className="btn-primary mt-8">
              Discover our services
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-4">
        <div className="container-x">
          <StatStrip items={stats} />
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <span className="eyebrow">Core values &amp; principles</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy-800 sm:text-4xl">
              Our business philosophy
            </h2>
            <p className="mt-4 text-slate-600">
              A few principles shape everything we do, from the first call to
              long after launch.
            </p>
          </div>
          <div className="space-y-6">
            {philosophy.map((item, index) => (
              <div key={item.title} className="flex gap-5">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-navy-800">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-navy-800">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <img src={img("why-1", 480, 560)} alt="Advisory meeting" className="h-full w-full rounded-xl object-cover" />
            <img src={img("why-2", 480, 560)} alt="Planning session" className="mt-8 h-full w-full rounded-xl object-cover" />
          </div>
          <div>
            <span className="eyebrow text-brand-300">Why work with us</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Partner with us for practical, reliable results
            </h2>
            <ul className="mt-8 space-y-4">
              {whyUsBullets.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-brand-100">
                  <Icon name="check" className="mt-0.5 h-4 w-4 flex-none text-brand-300" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn mt-8 bg-white text-brand-700 hover:bg-brand-50">
              Get started
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Get to know us"
            title="Your team of dedicated experts"
            subtitle="Our team brings practical experience and a hands-on approach to every project we take on."
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {team.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-x">
          <SectionHeading eyebrow="Milestones" title="Discover our history" align="center" />
          <div className="mt-12 space-y-10">
            {milestones.map((item) => (
              <div key={item.year} className="grid items-center gap-6 lg:grid-cols-12">
                <div className="lg:col-span-2">
                  <div className="text-2xl font-extrabold text-brand-600">{item.year}</div>
                </div>
                <div className="lg:col-span-6">
                  <h3 className="text-lg font-semibold text-navy-800">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
                <div className="lg:col-span-4">
                  <img src={img(item.image, 520, 320)} alt={item.title} className="w-full rounded-xl object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-20">
        <CTABand
          eyebrow="Practical advice. Meaningful results."
          title="Strategic technology solutions for long-term success"
          primary={{ href: "/contact", label: "Request a consultation" }}
          secondary={{ href: "/services", label: "Explore services" }}
        />
      </section>
    </>
  );
}
