// The three professors shown on the student "Expert" page.
//
// Each one answers questions through the /api/ask proxy (see
// functions/api/ask.ts). The `id` is sent to the server, which maps it to a
// fixed persona prompt — so the client can never inject its own instructions.

export type Professor = {
  id: string;
  name: string;
  subject: string;
  blurb: string;
};

export const PROFESSORS: Professor[] = [
  {
    id: "web",
    name: "Prof. Meera Rao",
    subject: "Web & Frontend",
    blurb: "HTML, CSS, JavaScript, React and everything that runs in the browser.",
  },
  {
    id: "data",
    name: "Prof. Arjun Nair",
    subject: "Data & Backend",
    blurb: "Node.js, APIs, databases, and turning raw data into decisions.",
  },
  {
    id: "career",
    name: "Prof. Sara Khan",
    subject: "Career & Interviews",
    blurb: "Resumes, interview preparation, and how to talk about your projects.",
  },
];

/** "Prof. Meera Rao" -> "MR" */
export function initialsOf(name: string): string {
  return name
    .replace(/^prof\.?\s*/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
