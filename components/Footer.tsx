import Link from "next/link";
import { services, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-slate-100 bg-slate-50">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              NQT
            </span>
            <span className="text-base font-bold text-slate-900">{site.name}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            {site.description}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li><Link href="/" className="hover:text-brand-700">Home</Link></li>
            <li><Link href="/services" className="hover:text-brand-700">Services</Link></li>
            <li><Link href="/about" className="hover:text-brand-700">About</Link></li>
            <li><Link href="/contact" className="hover:text-brand-700">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Services</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {services.slice(0, 5).map((service) => (
              <li key={service.title}>
                <Link href="/services" className="hover:text-brand-700">
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Get in touch</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>{site.email}</li>
            <li>{site.phone}</li>
            <li>{site.address}</li>
            <li>{site.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-500 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Built with Next.js &amp; Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
