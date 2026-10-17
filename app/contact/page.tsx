import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Icon from "@/components/Icon";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact NQT Infotech for web development, mobile apps, cloud and custom software projects.",
};

const details = [
  { icon: "mail", label: "Email", value: site.email },
  { icon: "phone", label: "Phone", value: site.phone },
  { icon: "pin", label: "Office", value: site.address },
  { icon: "clock", label: "Hours", value: site.hours },
];

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-slate-100 bg-gradient-to-b from-brand-50 to-white">
        <div className="container-x py-16 sm:py-20">
          <span className="eyebrow">Contact</span>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Let us talk about your project
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            Share a few details and our team will respond within one working
            day with next steps.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-slate-900">
              Send us an enquiry
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Fields marked required must be filled in.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-slate-100 bg-slate-50/60 p-8">
              <h2 className="text-lg font-semibold text-slate-900">
                Contact details
              </h2>
              <ul className="mt-6 space-y-5">
                {details.map((item) => (
                  <li key={item.label} className="flex gap-3">
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm">
                      <Icon name={item.icon} className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {item.label}
                      </div>
                      <div className="text-sm text-slate-800">{item.value}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
