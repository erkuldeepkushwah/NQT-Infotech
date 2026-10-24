"use client";

import { useState } from "react";
import { PROFESSORS, initialsOf, type Professor } from "@/lib/professors";
import { askGemini } from "@/lib/ai";

const UNAVAILABLE = "__unavailable__";

export default function Experts() {
  const [questions, setQuestions] = useState<Record<string, string>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<Record<string, boolean>>({});

  async function ask(p: Professor) {
    const question = (questions[p.id] || "").trim();
    if (!question || busy[p.id]) return;

    setBusy((b) => ({ ...b, [p.id]: true }));
    setAnswers((a) => ({ ...a, [p.id]: "" }));

    const result = await askGemini(question, { persona: p.id, topic: p.subject });

    setBusy((b) => ({ ...b, [p.id]: false }));
    setAnswers((a) => ({ ...a, [p.id]: result ? result.text : UNAVAILABLE }));
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">Expert</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-600">
        Talk to a professor. Ask anything about your track and get an answer right here.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {PROFESSORS.map((p) => {
          const answer = answers[p.id];
          const isBusy = !!busy[p.id];
          const question = questions[p.id] || "";
          return (
            <div key={p.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {initialsOf(p.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-bold text-navy-800">{p.name}</p>
                  <p className="truncate text-xs text-slate-500">{p.subject}</p>
                </div>
              </div>

              <p className="mt-3 text-sm text-slate-600">{p.blurb}</p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(p);
                }}
                className="mt-4 flex flex-1 flex-col"
              >
                <textarea
                  value={question}
                  onChange={(e) => setQuestions((s) => ({ ...s, [p.id]: e.target.value }))}
                  placeholder={"Ask " + p.name + " a question..."}
                  rows={3}
                  aria-label={"Ask " + p.name}
                  className="field mt-0 flex-1 resize-none"
                />
                <button
                  type="submit"
                  disabled={!question.trim() || isBusy}
                  className="btn-primary mt-3 w-full disabled:opacity-50"
                >
                  {isBusy ? "Thinking…" : "Ask"}
                </button>
              </form>

              {answer ? (
                <div className="mt-3 rounded-lg border border-brand-100 bg-brand-50/50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
                    {p.name}
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm text-slate-700">
                    {answer === UNAVAILABLE
                      ? "The AI professor is not connected on this host yet. Connect a Gemini key to enable answers."
                      : answer}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
}
