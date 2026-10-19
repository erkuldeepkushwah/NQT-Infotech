/**
 * Next.js config.
 *
 * Normal development and builds work as usual:
 *   npm run dev      -> local dev server
 *   npm run build    -> server build in .next
 *   npm start        -> serve the build
 *
 * For GitHub Pages the site is exported as static HTML with a base path:
 *   npm run build:pages   -> writes ./out, ready for the gh-pages branch
 *
 * @type {import('next').NextConfig}
 */

const isPages = process.env.EXPORT_FOR_PAGES === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  ...(isPages
    ? {
        output: "export",
        basePath: basePath,
        assetPrefix: basePath || undefined,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
