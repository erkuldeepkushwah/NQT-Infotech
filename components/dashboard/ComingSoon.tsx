import Link from "next/link";

export default function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">{title}</h1>
      <p className="mt-1 text-sm text-slate-600">{description}</p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm text-slate-600">
          This section is part of the learning platform and is still being built. It will
          appear here once the course content is connected.
        </p>
        <Link href="/dashboard" className="btn-primary mt-5">
          Back to dashboard
        </Link>
      </div>
    </>
  );
}
