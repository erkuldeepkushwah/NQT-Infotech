# NQT Infotech

Marketing website for **NQT Infotech**, an IT services company, built with
[Next.js](https://nextjs.org) (App Router) and Tailwind CSS.

## Pages

- `/` - Home (hero, services overview, why us, process, CTA)
- `/services` - Full list of services and tech stack
- `/about` - Company story, mission, values
- `/contact` - Contact details and enquiry form

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
components/   Reusable UI components (Navbar, Footer, cards...)
lib/          Site content and configuration
public/       Static assets (logo, etc.)
```

## Customising

All company details, services, stats and contact information live in
`lib/site.ts` - edit that single file to update the content across the site.

## Deploy

The easiest way to deploy is [Vercel](https://vercel.com/new). Any Node.js
host that supports Next.js will also work.
