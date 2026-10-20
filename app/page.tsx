import Link from "next/link";
import Icon from "@/components/Icon";
import ServiceCard from "@/components/ServiceCard";
import BlogCard from "@/components/BlogCard";
import TestimonialCard from "@/components/TestimonialCard";
import StatStrip from "@/components/StatStrip";
import LogoStrip from "@/components/LogoStrip";
import CTABand from "@/components/CTABand";
import SectionHeading from "@/components/SectionHeading";
import { img, png } from "@/lib/images";
import {
  aboutBullets,
  benefits,
  blogPosts,
  segments,
  services,
  site,
  stats,
  teamStats,
  testimonials,
} from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden banner-bg">
        <div className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[560px] w-[760px] rounded-full bg-brand-500/40 blur-3xl" />
        <div className="container-x grid items-end gap-12 pt-16 sm:pt-24 lg:grid-cols-[55fr_45fr]">
          <div className="pb-16 sm:pb-24">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
              Let&apos;s make technology work for you
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              {site.tagline}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-100 sm:text-lg">
              {site.heroText}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/services" className="btn bg-white text-brand-700 hover:bg-brand-50">
                Discover services
              </Link>
              <Link href="/contact" className="btn-outline">
                Get a quote
              </Link>
            </div>
          </div>
          {/* Figure: right-aligned and standing on the bottom edge of the banner so
              it meets the blue band with no gap. Sized by height so the whole upper
              body and the laptop stay visible at every width. */}
          <div className="relative flex items-end justify-center lg:justify-end">
            <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-white/30 to-brand-400/10 blur-3xl sm:h-[500px] sm:w-[500px] lg:h-[660px] lg:w-[660px]" />
            <img
              src={png("brivora-hero")}
              alt="Brivora consultant working on a laptop"
              className="h-[400px] w-auto max-w-none object-contain drop-shadow-[0_28px_50px_rgba(2,10,35,0.6)] sm:h-[520px] lg:h-[680px]"
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our services"
            title="Technical expertise you can trust"
            subtitle="Whatever stage your business is at, we have the team and the tools to design, build and run the technology behind it."
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 3).map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/services" className="btn-ghost">
              View all services <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section bg-slate-50">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <img src={img("nqt-about-1", 480, 560)} alt="Team collaboration" className="h-full w-full rounded-xl object-cover" />
            <img src={img("nqt-about-2", 480, 560)} alt="Developers working" className="mt-8 h-full w-full rounded-xl object-cover" />
          </div>
          <div>
            <span className="eyebrow">About us</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy-800 sm:text-4xl">
              Your partners in smart technology solutions
            </h2>
            <p className="mt-4 text-slate-600">
              {site.name} helps businesses handle growth, change and challenges
              with practical technology. We combine experience with a genuinely
              consultative way of working.
            </p>
            <ul className="mt-6 space-y-3">
              {aboutBullets.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                  <Icon name="check" className="mt-0.5 h-4 w-4 flex-none text-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/services" className="btn-primary mt-8">
              Discover our services
            </Link>
          </div>
        </div>
      </section>

      {/* Segments */}
      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <span className="eyebrow">Why choose us</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy-800 sm:text-4xl">
              Smart technology solutions for every business
            </h2>
            <p className="mt-4 text-slate-600">
              From your first website to enterprise systems, we tailor our work
              to the size and goals of your organisation.
            </p>
            <div className="mt-8">
              <img src={img("nqt-segments", 720, 460)} alt="Business solutions" className="h-[240px] w-full rounded-xl object-cover" />
            </div>
          </div>
          <div className="space-y-5">
            {segments.map((segment) => (
              <div key={segment.title} className="card p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                    <Icon name={segment.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-navy-800">{segment.title}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-600">{segment.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {segment.points.map((point) => (
                    <span key={point} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section bg-navy-800">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow text-brand-300">Why choose us</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              The benefits of expert IT support and planning
            </h2>
            <div className="mt-10 space-y-8">
              {benefits.map((benefit, index) => (
                <div key={benefit.title} className="flex gap-5">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-brand-400/40 text-sm font-bold text-brand-300">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{benefit.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-brand-100">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src={img("nqt-benefits", 720, 720)} alt="IT consulting" className="h-[240px] w-full rounded-xl object-cover" />
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm leading-relaxed text-brand-100">
                &ldquo;We started working with Brivora to make our systems
                smarter and more efficient. The impact on our daily operations
                has been remarkable.&rdquo;
              </p>
              <div className="mt-4 text-sm font-semibold text-white">Operations Lead, Logistics client</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team expertise */}
      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <img src={img("nqt-team-1", 480, 560)} alt="Team meeting" className="h-full w-full rounded-xl object-cover" />
            <img src={img("nqt-team-2", 480, 560)} alt="Strategy session" className="mt-8 h-full w-full rounded-xl object-cover" />
          </div>
          <div>
            <span className="eyebrow">Team expertise</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy-800 sm:text-4xl">
              Turning business challenges into growth opportunities
            </h2>
            <p className="mt-4 text-slate-600">
              Our consultants work closely with your team to understand the real
              problem before proposing a solution, then stay involved until the
              results are in.
            </p>
            <div className="mt-8">
              <StatStrip items={teamStats} />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-slate-50">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our clients&apos; results"
            title="Real business results, backed by our expert guidance"
            align="center"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((item) => (
              <TestimonialCard key={item.name} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-20">
        <CTABand
          eyebrow="Trusted guidance for confident decisions"
          title="Expert strategic technology support for long-term success"
          text="Tell us about your goals and we will come back with a clear plan and an estimate within one working day."
          primary={{ href: "/contact", label: "Schedule a consultation" }}
          secondary={{ href: "/services", label: "Explore services" }}
        />
      </section>

      {/* Logo strip */}
      <section className="pb-20">
        <div className="container-x">
          <p className="text-center text-sm text-slate-500">
            Trusted by the world&apos;s leading companies
          </p>
          <div className="mt-8">
            <LogoStrip />
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="section bg-slate-50">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Latest insights" title="Latest insights from our blog" />
            <Link href="/blog" className="btn-ghost">
              View all articles
            </Link>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.title} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
