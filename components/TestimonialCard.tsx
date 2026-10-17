import { avatar } from "@/lib/images";
import Icon from "@/components/Icon";
import type { Testimonial } from "@/lib/site";

export default function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article className="card flex h-full flex-col p-7">
      <div className="flex gap-1 text-brand-500">
        {[0, 1, 2, 3, 4].map((i) => (
          <Icon key={i} name="star" className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="mt-5 text-lg font-bold text-navy-800">{item.metric}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{item.quote}</p>
      <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
        <img
          src={avatar(item.avatarIndex)}
          alt={item.name}
          loading="lazy"
          className="h-11 w-11 rounded-full object-cover"
        />
        <div>
          <div className="text-sm font-semibold text-navy-800">{item.name}</div>
          <div className="text-xs text-slate-500">{item.role}</div>
        </div>
      </div>
    </article>
  );
}
