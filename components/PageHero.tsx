export default function PageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="container-x pt-5 sm:pt-6">
      <section className="relative isolate overflow-hidden rounded-2xl banner-bg">
        <div className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[520px] w-[720px] rounded-full bg-brand-500/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 -z-10 h-[360px] w-[520px] rounded-full bg-brand-400/20 blur-3xl" />
        <div className="px-6 py-14 sm:px-10 sm:py-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-5 max-w-2xl text-lg text-brand-100">{subtitle}</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
