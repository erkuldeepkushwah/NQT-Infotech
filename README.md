# NQT Infotech

Marketing website for **NQT Infotech**, an IT services company, built with
[Next.js](https://nextjs.org) (App Router) and Tailwind CSS.

The layout follows a modern corporate IT-consulting design: a royal-blue and
navy theme, curved page banners, alternating light sections and a card based
content system.

## Pages

| Route | Description |
| --- | --- |
| `/` | Home - hero, feature strip, services, about, audience segments, benefits, stats, testimonials, logo strip, latest insights |
| `/about` | Company story, stats, business philosophy, "why work with us", team, milestones timeline |
| `/services` | Service gallery, client-focused approach, consulting process, get started |
| `/courses` | Training course cards with pricing and enrolment CTAs |
| `/blog` | Category filter and article grid |
| `/contact` | Contact details and consultation request form |
| `/login` | Client portal login screen |

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Build

```bash
npm run build
npm start
```

## Project structure

```
app/          App Router pages and global styles
components/   Reusable UI components (Navbar, Footer, cards, banners...)
lib/          Site content, configuration and image helpers
public/       Static assets (logo, etc.)
```

## Customising

Everything you are likely to change lives in two files:

- `lib/site.ts` - company details, services, courses, blog posts, team,
  testimonials, stats, process steps and timeline. Edit once and it updates
  across the whole site.
- `lib/images.ts` - image helpers. Real photos live in `public/img/<key>.jpg`
  and are listed in the `WITH_PHOTO` array. Any slot without a photo falls
  back to the generated placeholder artwork in `public/img/<key>.svg`, so the
  layout never shows a broken image. To add a photo for an empty slot, drop
  the file in as `public/img/<key>.jpg` and add the key to `WITH_PHOTO`.

Brand colours and typography are defined in `tailwind.config.ts`.

## Firebase

Firebase powers two things on the site:

- **Contact form** - each enquiry is written to the `enquiries` collection in
  Cloud Firestore, then read in the Firebase console.
- **Login page** - Firebase Authentication with the Email/Password provider.

### Setup

1. Copy the env file and fill it in from Firebase console -> Project settings
   -> Your apps -> Web app:

   ```bash
   cp .env.local.example .env.local
   ```

   `.env.local` is git-ignored. The values are still public once the site is
   built - Firebase web config is public by design - so they are protected by
   the rules below, not by secrecy.

2. **Authentication** - in the console, enable the Email/Password sign-in
   provider. Users can then register at `/login` with their name, email and
   password, and sign in with the same details.

3. **Firestore** - create the database, then publish the rules in
   `firestore.rules` (Firestore -> Rules). They let anyone *create* an
   enquiry but nobody read, edit or delete one from the browser.

4. **Lock down the API key** - in Google Cloud console -> APIs & Services ->
   Credentials, restrict the browser key to your site's domain, and consider
   enabling Firebase App Check.

Without `.env.local` the site still builds and runs: the contact form and
login just report that they are not connected yet.

## Deploy

### GitHub Pages

The live site is published from the `docs/` folder on `main`:

```bash
npm run build:pages      # static export into ./out
cp -r out/. docs/        # copy over the new build, keep the old files
git add docs && git commit -m "Deploy" && git push
```

Do **not** delete `docs/` before copying (`rm -rf docs && cp -r out docs`).
Old builds leave hashed files under `docs/_next/static/` behind, and a visitor
whose browser still holds the previous HTML will ask for exactly those files.
If they are gone the page fails with "Application error: a client-side
exception has occurred" until that cached HTML expires. Copying over the top
keeps the old files in place so cached visitors keep working.

GitHub Pages serves it at https://erkuldeepkushwah.github.io/NQT-Infotech/ .

Because the site lives under a sub-path, the Pages build uses a base path of
`/NQT-Infotech` (set in `scripts/build-pages.mjs`). If you rename the
repository, update `PAGES_BASE_PATH` there to match.

### Other hosts

Any static host works with the `out/` folder from `npm run build:pages`.
[Vercel](https://vercel.com/new) and Netlify also build the site directly from
the repository - use the default build command (`npm run build`) there.
