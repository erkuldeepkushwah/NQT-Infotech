// Image helpers.
//
// Real photos live in `public/img/<key>.jpg`. Any slot that does not have a
// photo yet falls back to the generated placeholder artwork in
// `public/img/<key>.svg`, so the layout never shows a broken image.

// Set by the GitHub Pages build so asset paths resolve under the
// /NQT-Infotech/ sub-path. Empty for normal local builds.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const WITH_PHOTO = [
  "about-a",
  "about-b",
  "avatar-11",
  "avatar-12",
  "avatar-15",
  "avatar-33",
  "avatar-44",
  "avatar-45",
  "avatar-47",
  "avatar-52",
  "blog-ai",
  "blog-cloud",
  "blog-digital",
  "blog-growth",
  "blog-services",
  "blog-support",
  "course-analytics",
  "course-cloud",
  "course-datascience",
  "course-fullstack",
  "course-python",
  "course-uiux",
  "nqt-about-1",
  "nqt-about-2",
  "nqt-ai",
  "nqt-analytics",
  "nqt-api",
  "nqt-benefits",
  "nqt-cloud",
  "nqt-cybersecurity",
  "nqt-design",
  "nqt-digital",
  "nqt-ecommerce",
  "nqt-hero",
  "nqt-mile-2016",
  "nqt-mile-2019",
  "nqt-mile-2022",
  "nqt-mile-2026",
  "nqt-mobile",
  "nqt-segments",
  "nqt-software",
  "nqt-support",
  "nqt-team-1",
  "nqt-team-2",
  "nqt-web",
  "svc-g1",
  "svc-g2",
  "svc-g3",
  "svc-g4",
  "svc-g5",
  "svc-g6",
  "why-1",
  "why-2",
];

export function img(seed: string, w: number, h: number): string {
  void w;
  void h;
  return BASE + (WITH_PHOTO.indexOf(seed) !== -1
    ? "/img/" + seed + ".jpg"
    : "/img/" + seed + ".svg");
}

// Cut-out artwork (transparent PNG) such as the hero figure.
export function png(name: string): string {
  return BASE + "/img/" + name + ".png";
}

export function avatar(n: number): string {
  const key = "avatar-" + n;
  return BASE + (WITH_PHOTO.indexOf(key) !== -1
    ? "/img/" + key + ".jpg"
    : "/img/" + key + ".svg");
}
