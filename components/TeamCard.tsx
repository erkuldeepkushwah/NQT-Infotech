import { avatar } from "@/lib/images";
import type { TeamMember } from "@/lib/site";

export default function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="card overflow-hidden">
      <div className="aspect-[4/5] overflow-hidden bg-slate-100">
        <img
          src={avatar(member.avatarIndex)}
          alt={member.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-navy-800">{member.name}</h3>
        <p className="mt-1 text-sm text-brand-600">{member.role}</p>
      </div>
    </article>
  );
}
