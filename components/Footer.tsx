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
    <footer className="bg-footer text-white">
      <div className="container-x grid gap-10 py-16 lg:grid-cols-4">
        <div>
          <Logo variant="light" />
          <ul className="mt-6 space-y-3 text-sm text-white/75">
            <li>
              <a href={"tel:" + site.phoneHref} className="font-semibold text-brand-300 hover:underline">
                Call: {site.phone}
              </a>
            </li>
            <li>
              <a href={"mailto:" + site.email} className="hover:text-white">
                {site.email}
              </a>
            </li>
            <li>{site.address}</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Info</h4>
          <ul className="mt-5 space-y-3 text-sm text-white/75">
            {infoLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-brand-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Services</h4>
          <ul className="mt-5 space-y-3 text-sm text-white/75">
            {serviceLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-brand-300">
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
                className="flex h-9 w-9 items-center justify-center rounded-md text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <Icon name={s.name} className="h-5 w-5" />
              </a>
            ))}
          </div>
          <form className="mt-6 flex items-center gap-2 rounded-md border border-white/20 px-3 py-2">
            <Icon name="search" className="h-4 w-4 text-white/50" />
            <input
              type="search"
              placeholder="Search..."
              aria-label="Search"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/50"
            />
          </form>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/60 sm:flex-row">
          <p>
            &copy; {site.name}, {new Date().getFullYear()}. All rights reserved.
          </p>
          <p>Built with Next.js &amp; Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
