"use client";

// AI answers for the learning panel and the Expert page.
//
// The Gemini key is NOT in the browser. Requests go to /api/ask — a
// server-side function (see functions/api/ask.ts) that holds GEMINI_API_KEY in
// its environment. If that endpoint is not available (for example on GitHub
// Pages, which serves only static files), the call fails and callers fall back
// to their own content (the learning panel uses its built-in question bank).

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const aiConfigured = true;

export type AskOptions = {
  /** Topic the question is about (a lesson or a professor's subject). */
  topic?: string;
  /** Persona id understood by the server (see lib/professors.ts). */
  persona?: string;
};

export async function askGemini(
  question: string,
  opts: AskOptions = {}
): Promise<{ text: string } | null> {
  try {
    const res = await fetch(BASE + "/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        topic: opts.topic || "",
        persona: opts.persona || "",
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { text?: string };
    const text = typeof data.text === "string" ? data.text.trim() : "";
    return text ? { text } : null;
  } catch {
    return null;
  }
}
