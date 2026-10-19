// Static export for GitHub Pages.
//
// Builds the site to ./out with the /NQT-Infotech base path so it works at
//   https://<user>.github.io/NQT-Infotech/
//
// Run with:  npm run build:pages
//
// If you rename the repository, change PAGES_BASE_PATH below (or set the
// NEXT_PUBLIC_BASE_PATH environment variable) to match.

import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const PAGES_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "/NQT-Infotech";

const env = {
  ...process.env,
  EXPORT_FOR_PAGES: "1",
  NEXT_PUBLIC_BASE_PATH: PAGES_BASE_PATH,
};

const result = spawnSync("next", ["build"], { stdio: "inherit", env, shell: true });
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

// GitHub Pages runs Jekyll by default, which ignores folders starting with an
// underscore - and Next.js puts all its assets in _next. This disables Jekyll.
writeFileSync("out/.nojekyll", "");
console.log("\nStatic export ready in ./out (base path: " + PAGES_BASE_PATH + ")");
