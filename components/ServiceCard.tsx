import Link from "next/link";
import Icon from "@/components/Icon";
import { img } from "@/lib/images";
import type { Service } from "@/lib/site";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="card group overflow-hidden">
      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={img(service.image, 640, 400)}
          alt={service.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-600">
            <Icon name={service.icon} className="h-5 w-5" />
          </span>
          <h3 className="text-lg font-semibold text-navy-800">{service.title}</h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.description}</p>
        <Link
          href="/services"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:gap-3"
        >
          Learn more <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
