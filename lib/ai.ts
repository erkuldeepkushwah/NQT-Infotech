"use client";

// AI Professor answers.
//
// The Gemini key is NOT in the browser. The request goes to /api/ask — a
// server-side function (see functions/api/ask.ts) that holds GEMINI_API_KEY in
// its environment. If that endpoint is not available (for example on GitHub
// Pages, which serves only static files), the call fails and the panel falls
// back to the built-in question bank.

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const aiConfigured = true;

export async function askGemini(
  question: string,
  topic: string
): Promise<{ text: string } | null> {
  try {
    const res = await fetch(BASE + "/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, topic }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { text?: string };
    const text = typeof data.text === "string" ? data.text.trim() : "";
    return text ? { text } : null;
  } catch {
    return null;
  }
}
