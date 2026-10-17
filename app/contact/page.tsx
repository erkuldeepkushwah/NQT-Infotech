import type { Metadata } from "next";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact NQT Infotech for web development, mobile apps, cloud and custom software projects.",
};

const details = [
  { icon: "phone", label: "Call us", value: site.phone, href: "tel:" + site.phoneHref },
  { icon: "mail", label: "Email", value: site.email, href: "mailto:" + site.email },
  { icon: "pin", label: "Location", value: site.address },
  { icon: "clock", label: "Business hours", value: site.hours },
];

const socials = [
  { name: "x", href: site.social.x },
  { name: "facebook", href: site.social.facebook },
  { name: "youtube", href: site.social.youtube },
  { name: "instagram", href: site.social.instagram },
];

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact" />

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Get in touch</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy-800 sm:text-4xl">
              Let&apos;s choose the best solution for your business!
            </h2>

            <ul className="mt-8 space-y-6">
              {details.map((item) => (
                <li key={item.label} className="flex gap-4">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-md bg-brand-50 text-brand-600">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-brand-600">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-slate-700 hover:underline">
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-sm text-slate-700">{item.value}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700"
                >
                  <Icon name={s.name} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-8">
            <h3 className="text-xl font-semibold text-navy-800">Need consultation?</h3>
            <p className="mt-2 text-sm text-slate-600">
              Send your query or request a callback and our specialist will get
              back to you shortly.
            </p>
            <div className="mt-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
