// Image helpers.
//
// Real photos live in `public/img/<key>.jpg`. Any slot that does not have a
// photo yet falls back to the generated placeholder artwork in
// `public/img/<key>.svg`, so the layout never shows a broken image.

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
  "blog-cloud",
  "blog-digital",
  "blog-support",
  "course-analytics",
  "course-cloud",
  "course-datascience",
  "course-fullstack",
  "course-python",
  "course-uiux",
  "nqt-about-1",
  "nqt-about-2",
  "nqt-benefits",
  "nqt-cloud",
  "nqt-design",
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
  return WITH_PHOTO.indexOf(seed) !== -1
    ? "/img/" + seed + ".jpg"
    : "/img/" + seed + ".svg";
}

export function avatar(n: number): string {
  const key = "avatar-" + n;
  return WITH_PHOTO.indexOf(key) !== -1
    ? "/img/" + key + ".jpg"
    : "/img/" + key + ".svg";
}
