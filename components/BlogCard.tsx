import { img } from "@/lib/images";
import type { BlogPost } from "@/lib/site";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group">
      <div className="aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
        <img
          src={img(post.image, 640, 400)}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-5 text-lg font-semibold leading-snug text-navy-800 group-hover:text-brand-600">
        {post.title}
      </h3>
      <div className="mt-3 flex items-center gap-3 text-xs">
        <span className="rounded bg-brand-50 px-2 py-1 font-medium text-brand-700">
          {post.category}
        </span>
        <span className="text-slate-500">{post.date}</span>
      </div>
    </article>
  );
}
