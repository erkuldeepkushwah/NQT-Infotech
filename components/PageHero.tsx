export default function PageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden banner-bg">
      <div className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[520px] w-[720px] rounded-full bg-brand-500/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 -z-10 h-[360px] w-[520px] rounded-full bg-brand-400/20 blur-3xl" />
      {/* Full-width band, kept short: just enough room for the page title. */}
      <div className="container-x py-10 sm:py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-2xl text-base text-brand-100">{subtitle}</p>
        ) : null}
      </div>
    </section>
  );
}
