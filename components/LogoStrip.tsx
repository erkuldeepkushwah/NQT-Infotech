import { clientLogos } from "@/lib/site";

export default function LogoStrip() {
  return (
    <div className="grid grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
      {clientLogos.map((name) => (
        <div
          key={name}
          className="text-center text-lg font-bold tracking-tight text-slate-400 transition hover:text-brand-600"
        >
          {name}
        </div>
      ))}
    </div>
  );
}
