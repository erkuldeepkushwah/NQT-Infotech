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
- `lib/images.ts` - image helpers. The site ships with locally generated
  placeholder artwork in `public/img/`, so it renders with no external
  requests. Replace the two helper functions with your own image URLs (or
  overwrite the files in `public/img/` keeping the same names) when you
  have real photography.

Brand colours and typography are defined in `tailwind.config.ts`.

## Deploy

The easiest way to deploy is [Vercel](https://vercel.com/new). Any Node.js
host that supports Next.js will also work.
