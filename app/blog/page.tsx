import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import BlogExplorer from "@/components/BlogExplorer";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights, expert advice and company news from the NQT Infotech team.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero title="Blog" />
      <section className="section">
        <div className="container-x">
          <BlogExplorer />
        </div>
      </section>
    </>
  );
}
