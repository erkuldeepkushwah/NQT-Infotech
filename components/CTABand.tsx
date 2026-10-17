import Link from "next/link";

export default function CTABand({
  eyebrow,
  title,
  text,
  primary,
  secondary,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="pb-20">
      <div className="container-x">
        <div className="relative isolate overflow-hidden rounded-2xl banner-bg px-8 py-14 sm:px-16">
          <div className="pointer-events-none absolute -right-24 -top-32 -z-10 h-[420px] w-[560px] rounded-full bg-brand-500/40 blur-3xl" />
          <div className="max-w-3xl">
            {eyebrow ? <span className="eyebrow text-brand-300">{eyebrow}</span> : null}
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{title}</h2>
            {text ? <p className="mt-4 text-brand-100">{text}</p> : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primary.href} className="btn bg-white text-brand-700 hover:bg-brand-50">
                {primary.label}
              </Link>
              {secondary ? (
                <Link href={secondary.href} className="btn-outline">
                  {secondary.label}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
