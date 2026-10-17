import Icon from "@/components/Icon";
import type { Service } from "@/lib/site";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="card">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon name={service.icon} className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-900">
        {service.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {service.description}
      </p>
      <ul className="mt-4 space-y-1.5">
        {service.points.map((point) => (
          <li key={point} className="flex items-center gap-2 text-sm text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
