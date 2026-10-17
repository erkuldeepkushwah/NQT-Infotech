"use client";

import { useState } from "react";
import BlogCard from "@/components/BlogCard";
import { blogCategories, blogPosts } from "@/lib/site";

export default function BlogExplorer() {
  const [active, setActive] = useState("All");
  const tabs = ["All"].concat(blogCategories);
  const posts =
    active === "All" ? blogPosts : blogPosts.filter((p) => p.category === active);

  return (
    <>
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
        {tabs.map((tab) => {
          const count =
            tab === "All"
              ? blogPosts.length
              : blogPosts.filter((p) => p.category === tab).length;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              className={
                "rounded-md px-3.5 py-2 text-sm font-medium transition " +
                (active === tab
                  ? "bg-brand-600 text-white"
                  : "text-slate-600 hover:bg-slate-50")
              }
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.title} post={post} />
        ))}
      </div>
    </>
  );
}
