import Link from "next/link";
import Logo from "@/components/Logo";
import Icon from "@/components/Icon";
import { site } from "@/lib/site";

const infoLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
];

const serviceLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const socials = [
  { name: "x", href: site.social.x },
  { name: "facebook", href: site.social.facebook },
  { name: "youtube", href: site.social.youtube },
  { name: "instagram", href: site.social.instagram },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="container-x grid gap-10 py-16 lg:grid-cols-4">
        <div>
          <Logo />
          <ul className="mt-6 space-y-3 text-sm text-slate-600">
            <li>
              <a href={"tel:" + site.phoneHref} className="font-semibold text-brand-600 hover:underline">
                Call: {site.phone}
              </a>
            </li>
            <li>
              <a href={"mailto:" + site.email} className="hover:text-brand-600">
                {site.email}
              </a>
            </li>
            <li>{site.address}</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-navy-800">Info</h4>
          <ul className="mt-5 space-y-3 text-sm text-slate-600">
            {infoLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-brand-600">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-navy-800">Services</h4>
          <ul className="mt-5 space-y-3 text-sm text-slate-600">
            {serviceLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-brand-600">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex gap-3">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.name}
                className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-brand-50 hover:text-brand-600"
              >
                <Icon name={s.name} className="h-5 w-5" />
              </a>
            ))}
          </div>
          <form className="mt-6 flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2">
            <Icon name="search" className="h-4 w-4 text-slate-400" />
            <input
              type="search"
              placeholder="Search..."
              aria-label="Search"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </form>
        </div>
      </div>

      <div className="border-t border-slate-100">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-slate-500 sm:flex-row">
          <p>
            &copy; {site.name}, {new Date().getFullYear()}. All rights reserved.
          </p>
          <p>Built with Next.js &amp; Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
