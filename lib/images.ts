// Image helpers.
//
// Real photos live in `public/img/<key>.jpg`. Any slot that does not have a
// photo yet falls back to the generated placeholder artwork in
// `public/img/<key>.svg`, so the layout never shows a broken image.

const WITH_PHOTO = [
  "nqt-hero",
  "nqt-about-1",
  "nqt-about-2",
  "nqt-segments",
  "nqt-benefits",
  "nqt-team-1",
  "nqt-team-2",
  "nqt-web",
  "nqt-mobile",
  "nqt-design",
  "nqt-cloud",
  "nqt-software",
  "nqt-support",
  "avatar-12",
  "avatar-45",
  "avatar-33",
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
