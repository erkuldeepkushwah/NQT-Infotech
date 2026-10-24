// Course slug: the checkout links to a course by slug, and an enrollment is
// stored under the same key, so the two always line up.
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
