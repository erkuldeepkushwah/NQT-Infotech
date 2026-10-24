"use client";

// Optional Gemini-backed answers for the AI Professor.
//
// The API key is read from NEXT_PUBLIC_GEMINI_API_KEY at build time. On a
// static host (GitHub Pages) that value ends up in the public bundle, so use a
// RESTRICTED key there. When the key is absent — or the call fails — the panel
// falls back to the built-in question bank, so the feature never breaks.

const KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-2.0-flash";

export const geminiConfigured = KEY.length > 0;

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
};

export async function askGemini(
  question: string,
  topic: string
): Promise<{ text: string } | null> {
  if (!KEY) return null;

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    MODEL +
    ":generateContent?key=" +
    encodeURIComponent(KEY);

  const prompt =
    'You are a friendly instructor for the topic "' +
    topic +
    '". Answer the student\'s question in 2-4 short sentences, then add one line starting with "Why it matters:".\n\nStudent question: ' +
    question;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 400 },
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as GeminiResponse;
    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || "")
        .join("")
        .trim() || "";
    return text ? { text } : null;
  } catch {
    return null;
  }
}
