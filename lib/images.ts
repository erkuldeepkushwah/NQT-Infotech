// Placeholder image helpers.
//
// The site ships with locally generated placeholder artwork in
// `public/img/`, so it renders correctly with no external requests.
// When you have real photography, replace the bodies of these two
// functions with your own image URLs (or drop your files into
// `public/img/` and keep the same filenames).

export function img(seed: string, w: number, h: number): string {
  void w;
  void h;
  return "/img/" + seed + ".svg";
}

export function avatar(n: number): string {
  return "/img/avatar-" + n + ".svg";
}
