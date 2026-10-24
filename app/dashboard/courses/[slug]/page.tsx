import { courses } from "@/lib/site";
import { slugify } from "@/lib/slug";
import LearningPanel from "./LearningPanel";

// The learning panel is a client component, but the route is dynamic. A static
// export (GitHub Pages, `output: "export"`) needs the full list of params up
// front, so we enumerate one page per catalogue course here.
export function generateStaticParams() {
  return courses.map((course) => ({ slug: slugify(course.title) }));
}

export default function CourseLearningPage() {
  return <LearningPanel />;
}
