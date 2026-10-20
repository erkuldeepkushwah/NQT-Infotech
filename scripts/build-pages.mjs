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
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const PAGES_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "/NQT-Infotech";

const env = {
  ...process.env,
  EXPORT_FOR_PAGES: "1",
  NEXT_PUBLIC_BASE_PATH: PAGES_BASE_PATH,
};

// Next.js loads .env.local itself; read it here too so the check below can see
// the same values.
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match && !env[match[1]]) {
      env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
}

// This build goes to the public site, so a missing Firebase config would
// publish a login page that cannot sign anybody in. Fail loudly instead of
// shipping a quietly broken site.
const REQUIRED_ENV = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];
const missing = REQUIRED_ENV.filter((key) => !env[key]);
if (missing.length > 0) {
  console.error("\n  Refusing to build for GitHub Pages.");
  console.error("  Missing Firebase config: " + missing.join(", "));
  console.error("  Copy .env.local.example to .env.local and fill it in (see README).\n");
  process.exit(1);
}

const result = spawnSync("next", ["build"], { stdio: "inherit", env, shell: true });
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

// GitHub Pages runs Jekyll by default, which ignores folders starting with an
// underscore - and Next.js puts all its assets in _next. This disables Jekyll.
writeFileSync("out/.nojekyll", "");
console.log("\nStatic export ready in ./out (base path: " + PAGES_BASE_PATH + ")");
