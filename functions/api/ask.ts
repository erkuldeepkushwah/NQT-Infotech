// Cloudflare Pages Function: POST /api/ask
//
// Holds the Gemini key server-side, so the browser never sees it. Set the key
// in the Cloudflare dashboard (Pages project → Settings → Environment
// variables) as a secret named GEMINI_API_KEY, and optionally GEMINI_MODEL.
//
// If the key is not set the endpoint answers 503 and the client falls back to
// its built-in question bank.

interface Env {
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
}

interface AskBody {
  question?: string;
  topic?: string;
}

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const { request, env } = context;

  const key = env.GEMINI_API_KEY;
  if (!key) return json({ error: "not_configured" }, 503);

  let body: AskBody;
  try {
    body = (await request.json()) as AskBody;
  } catch {
    return json({ error: "bad_request" }, 400);
  }

  const question = (body.question || "").trim();
  const topic = (body.topic || "").trim();
  if (!question) return json({ error: "bad_request" }, 400);

  const model = env.GEMINI_MODEL || "gemini-2.0-flash";
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    model +
    ":generateContent?key=" +
    encodeURIComponent(key);

  const prompt =
    'You are a friendly instructor for the topic "' +
    topic +
    '". Answer the student\'s question in 2-4 short sentences, then add one line starting with "Why it matters:".\n\nStudent question: ' +
    question;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 400 },
      }),
    });
  } catch {
    return json({ error: "upstream_unreachable" }, 502);
  }

  if (!res.ok) return json({ error: "upstream_error" }, 502);

  const data = (await res.json()) as GeminiResponse;
  const text =
    data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || "")
      .join("")
      .trim() || "";

  if (!text) return json({ error: "empty" }, 502);
  return json({ text });
};
