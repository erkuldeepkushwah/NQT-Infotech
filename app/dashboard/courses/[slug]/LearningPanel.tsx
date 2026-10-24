"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { enrolledSlugs, useMyEnrollments } from "@/lib/enrollments";
import { slugify } from "@/lib/slug";
import { courses as siteCourses } from "@/lib/site";
import { flatten, syllabusFor, totalLessons } from "@/lib/syllabus";
import { questionsFor, subjectOf, type QA } from "@/lib/questions";
import { askGemini, aiConfigured } from "@/lib/ai";

const TASK_LABELS = ["Review component notes", "Complete quick quiz"];
const TASK_MINUTES = [5, 2];
const EST_MINUTES = TASK_MINUTES.reduce((a, b) => a + b, 0);

export default function LearningPanel() {
  const rawParams = useParams();
  const slug = Array.isArray(rawParams?.slug)
    ? (rawParams.slug as string[])[0]
    : ((rawParams?.slug as string) || "");

  const course = useMemo(() => siteCourses.find((c) => slugify(c.title) === slug), [slug]);
  const syllabus = useMemo(
    () => (course ? syllabusFor(course.title, course.description) : null),
    [course]
  );
  const lessons = useMemo(() => (syllabus ? flatten(syllabus) : []), [syllabus]);
  const total = syllabus ? totalLessons(syllabus) : 0;

  const { user } = useCurrentUser();
  const { rows: enrollments, loading: enrollLoading } = useMyEnrollments(user?.uid || "");

  const [completed, setCompleted] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [tasks, setTasks] = useState<boolean[]>(TASK_MINUTES.map(() => false));
  const [openModules, setOpenModules] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Q&A: which of the 20 questions have had their answer revealed.
  const [revealed, setRevealed] = useState<number[]>([]);

  // AI Professor: the student's question, and the answer it matched.
  const [ask, setAsk] = useState("");
  const [reply, setReply] = useState<QA | null>(null);
  const [aiAnswer, setAiAnswer] = useState("");
  const [thinking, setThinking] = useState(false);
  const [noMatch, setNoMatch] = useState(false);

  const storageKey = "brivora:learning:" + slug;

  // Load saved progress, or seed the course's starting point on first visit.
  useEffect(() => {
    if (!syllabus) return;
    setHydrated(false);
    let done: number[] | null = null;
    let cur: number | null = null;
    let savedTasks: boolean[] | null = null;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          completed?: number[];
          current?: number;
          tasks?: boolean[];
        };
        if (Array.isArray(parsed.completed)) done = parsed.completed;
        if (typeof parsed.current === "number") cur = parsed.current;
        if (Array.isArray(parsed.tasks)) savedTasks = parsed.tasks;
      }
    } catch {
      /* ignore unreadable storage */
    }
    if (!done) {
      const n = Math.min(syllabus.defaultCompleted, total);
      done = Array.from({ length: n }, (_, i) => i);
    }
    setCompleted(done.filter((i) => i >= 0 && i < total));
    setCurrent(
      typeof cur === "number"
        ? Math.min(Math.max(0, cur), Math.max(0, total - 1))
        : Math.min(syllabus.defaultCompleted, Math.max(0, total - 1))
    );
    setTasks(
      savedTasks && savedTasks.length === TASK_MINUTES.length
        ? savedTasks
        : TASK_MINUTES.map(() => false)
    );
    setHydrated(true);
  }, [syllabus, storageKey, total]);

  // Remember progress in the browser.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ completed, current, tasks }));
    } catch {
      /* storage may be unavailable */
    }
  }, [hydrated, storageKey, completed, current, tasks]);

  // Keep the module that holds the current lesson open.
  useEffect(() => {
    if (!lessons.length) return;
    const mi = lessons[Math.min(current, lessons.length - 1)].moduleIndex;
    setOpenModules((prev) => (prev.includes(mi) ? prev : [...prev, mi]));
  }, [current, lessons]);

  const lesson = lessons[current];

  // Reset the Q&A and the AI Professor whenever the lesson (topic) changes.
  useEffect(() => {
    setRevealed([]);
    setAsk("");
    setReply(null);
    setAiAnswer("");
    setThinking(false);
    setNoMatch(false);
  }, [current]);

  const questions = useMemo(() => (lesson ? questionsFor(lesson.title) : []), [lesson]);

  // --- Course not found -----------------------------------------------------
  if (!course || !syllabus || !lesson) {
    return (
      <>
        <h1 className="text-2xl font-bold text-navy-800">Course not found</h1>
        <p className="mt-1 text-sm text-slate-600">
          We could not find a course for that link.
        </p>
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-10 text-center">
          <Link href="/dashboard/courses" className="btn-primary">
            Back to My courses
          </Link>
        </div>
      </>
    );
  }

  // --- Progress maths -------------------------------------------------------
  const completedSet = new Set(completed);
  const completedCount = completed.filter((i) => i < total).length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const currentModuleIndex = lesson.moduleIndex;
  const moduleCount = syllabus.modules.length;

  const owned = enrolledSlugs(enrollments);
  const notEnrolled = !enrollLoading && enrollments.length > 0 && !owned.has(slug);

  const isDone = completedSet.has(current);
  const allTasksDone = tasks.every(Boolean);
  const allRevealed = revealed.length === questions.length;

  function toggleComplete() {
    setCompleted((prev) =>
      prev.includes(current)
        ? prev.filter((i) => i !== current)
        : [...prev, current].sort((a, b) => a - b)
    );
  }

  function goTo(index: number) {
    if (index < 0 || index >= total) return;
    setCurrent(index);
  }

  function toggleModule(mi: number, locked: boolean) {
    if (locked) return;
    setOpenModules((prev) =>
      prev.includes(mi) ? prev.filter((x) => x !== mi) : [...prev, mi]
    );
  }

  function toggleAnswer(i: number) {
    setRevealed((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  }

  function toggleAllAnswers() {
    setRevealed(allRevealed ? [] : questions.map((_, i) => i));
  }

  async function askProfessor() {
    const q = ask.trim();
    if (!q) return;

    // Prefer the AI Professor when a Gemini key is configured; fall back to the
    // built-in question bank otherwise (or if the call fails).
    if (aiConfigured) {
      setThinking(true);
      setReply(null);
      setAiAnswer("");
      setNoMatch(false);
      const result = await askGemini(q, subjectOf(lesson.title));
      setThinking(false);
      if (result) {
        setAiAnswer(result.text);
        return;
      }
    }

    const match = bestMatch(q, questions);
    if (match) {
      setReply(match);
      setAiAnswer("");
      setNoMatch(false);
    } else {
      setReply(null);
      setAiAnswer("");
      setNoMatch(true);
    }
  }

  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-xs" aria-label="Breadcrumb">
        <Link href="/dashboard/courses" className="font-medium text-brand-600 hover:underline">
          My Courses
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-500">{course.title}</span>
        <span className="text-slate-300">/</span>
        <span className="font-medium text-slate-700">Learning</span>
      </nav>

      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Main column */}
        <div className="min-w-0">
          {/* Header */}
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 5h18v11H3zM8 20h8M12 16v4" />
              </svg>
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-navy-800">{course.title}</h1>
              <p className="mt-1 text-sm text-slate-600">{syllabus.subtitle}</p>
            </div>
          </div>

          {/* Overall progress */}
          <div className="mt-5 flex items-center gap-4">
            <span className="flex-none text-sm font-medium text-slate-600">
              Module {currentModuleIndex + 1} of {moduleCount}
            </span>
            <div className="h-2 flex-1 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-brand-600 transition-all" style={{ width: pct + "%" }} />
            </div>
            <span className="flex-none text-sm font-semibold text-navy-800">{pct}%</span>
          </div>

          {/* Topic Q&A (replaces the video player) */}
          <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
            {/* AI Professor */}
            <div className="border-b border-slate-100 bg-brand-50/60 px-4 py-4 sm:px-5">
              <div className="flex items-start gap-4">
                <ProfessorAvatar />
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-bold text-navy-800">
                    AI Professor
                    <span className="rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      AI
                    </span>
                  </p>
                  <p className="text-xs text-slate-500">Ask about {subjectOf(lesson.title)}</p>
                  <p className="mt-2 text-sm text-slate-700">
                    &ldquo;We are on <span className="font-semibold">{subjectOf(lesson.title)}</span>. Type a
                    question below and I will explain it — or work through the 20 topic questions
                    underneath.&rdquo;
                  </p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  askProfessor();
                }}
                className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center"
              >
                <input
                  value={ask}
                  onChange={(e) => setAsk(e.target.value)}
                  placeholder={"Ask the AI Professor about " + subjectOf(lesson.title) + "..."}
                  aria-label="Ask the AI Professor"
                  className="field mt-0 flex-1"
                />
                <button
                  type="submit"
                  disabled={!ask.trim() || thinking}
                  className="btn-primary px-5 py-2.5 disabled:opacity-50"
                >
                  {thinking ? "Thinking…" : "Ask"}
                </button>
              </form>

              {thinking ? (
                <p className="mt-3 rounded-lg border border-brand-100 bg-white p-3 text-sm text-slate-500">
                  AI Professor is thinking…
                </p>
              ) : null}

              {aiAnswer ? (
                <div className="mt-3 rounded-lg border border-brand-100 bg-white p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
                    AI Professor
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{aiAnswer}</p>
                </div>
              ) : null}

              {reply ? (
                <div className="mt-3 rounded-lg border border-brand-100 bg-white p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
                    AI Professor
                  </p>
                  <p className="mt-1 text-sm font-medium text-navy-800">{reply.question}</p>
                  <p className="mt-2 text-sm text-slate-700">
                    <span className="font-semibold text-green-700">Answer: </span>
                    {reply.answer}
                  </p>
                  <p className="mt-2 text-xs text-slate-600">
                    <span className="font-semibold text-brand-700">Explanation: </span>
                    {reply.explanation}
                  </p>
                </div>
              ) : null}

              {noMatch ? (
                <p className="mt-3 rounded-lg border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800">
                  I could not find that in this topic. Try asking about something from{" "}
                  <span className="font-semibold">{subjectOf(lesson.title)}</span>, or use the 20 questions
                  below.
                </p>
              ) : null}
            </div>

            {/* Q&A header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
              <h3 className="text-sm font-bold text-navy-800">Topic questions</h3>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">
                  {revealed.length}/{questions.length} answered
                </span>
                <button
                  type="button"
                  onClick={toggleAllAnswers}
                  className="text-xs font-semibold text-brand-600 hover:underline"
                >
                  {allRevealed ? "Hide all" : "Reveal all"}
                </button>
              </div>
            </div>

            {/* Questions */}
            <ol>
              {questions.map((qa, i) => {
                const open = revealed.includes(i);
                return (
                  <li key={i} className="border-b border-slate-100 last:border-0">
                    <button
                      type="button"
                      onClick={() => toggleAnswer(i)}
                      aria-expanded={open}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 sm:px-5"
                    >
                      <span
                        className={
                          "mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full text-[11px] font-bold " +
                          (open ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500")
                        }
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1 text-sm font-medium text-navy-800">
                        {qa.question}
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={"mt-0.5 flex-none text-slate-400 transition-transform " + (open ? "rotate-180" : "")}
                        aria-hidden="true"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>

                    {open ? (
                      <div className="px-4 pb-4 sm:px-5">
                        <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3 sm:ml-9">
                          <p className="text-sm text-slate-700">
                            <span className="font-semibold text-green-700">Answer: </span>
                            {qa.answer}
                          </p>
                          <p className="mt-2 text-xs text-slate-600">
                            <span className="font-semibold text-brand-700">Explanation: </span>
                            {qa.explanation}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </section>

          {/* Lesson detail */}
          <h2 className="mt-6 text-xl font-bold text-navy-800">{lesson.title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">{lesson.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={toggleComplete}
              className={isDone ? "btn border border-green-200 bg-green-50 text-green-700 hover:bg-green-100" : "btn-primary"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {isDone ? "Completed" : "Mark as Complete"}
            </button>
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              disabled={current === 0}
              className="btn-ghost disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
              </svg>
              Previous Lesson
            </button>
            <button
              type="button"
              onClick={() => goTo(current + 1)}
              disabled={current >= total - 1}
              className="btn-ghost disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next Lesson
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14m0 0-6-6m6 6-6 6" />
              </svg>
            </button>

            <span className="ml-auto flex items-center gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {lesson.duration} min
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 4h6v3H9zM7 5H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-1" />
                </svg>
                {lesson.type === "project" ? "Project lesson" : lesson.type === "quiz" ? "Quiz lesson" : "Topic questions"}
              </span>
            </span>
          </div>

          {/* Today's learning tasks */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 font-bold text-navy-800">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600" aria-hidden="true">
                  <path d="M9 4h6v3H9zM7 5H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-1" />
                </svg>
                Today&rsquo;s Learning Tasks
              </h3>
              <span className="flex items-center gap-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 3v4m10-4v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
                  </svg>
                  Due Today
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  Est. {EST_MINUTES} min
                </span>
              </span>
            </div>

            <ul className="mt-3 divide-y divide-slate-100">
              {TASK_LABELS.map((label, i) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => setTasks((prev) => prev.map((v, j) => (j === i ? !v : v)))}
                    className="flex w-full items-center gap-3 py-3 text-left"
                  >
                    <span
                      className={
                        "flex h-5 w-5 flex-none items-center justify-center rounded border " +
                        (tasks[i] ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 bg-white")
                      }
                    >
                      {tasks[i] ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      ) : null}
                    </span>
                    <span className={"flex-1 text-sm " + (tasks[i] ? "text-slate-400 line-through" : "text-slate-700")}>
                      {label}
                    </span>
                    <span className="text-xs text-slate-400">{TASK_MINUTES[i]} min</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300" aria-hidden="true">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            {allTasksDone ? (
              <p className="mt-2 rounded-md bg-green-50 px-3 py-2 text-xs font-medium text-green-700">
                All of today&rsquo;s tasks are done. Nice work.
              </p>
            ) : null}
          </div>
        </div>

        {/* Syllabus sidebar */}
        <aside className="lg:sticky lg:top-[84px] lg:self-start">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold text-navy-800">Course syllabus</h2>
                <span className="flex-none text-xs font-medium text-slate-500">
                  {completedCount}/{total} lessons completed
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-brand-600 transition-all" style={{ width: pct + "%" }} />
              </div>
            </div>

            {notEnrolled ? (
              <p className="px-4 py-4 text-xs text-slate-500">
                You are previewing this course.{" "}
                <Link href="/dashboard/browse" className="font-medium text-brand-600 hover:underline">
                  Enrol to unlock every lesson →
                </Link>
              </p>
            ) : null}

            <div>
              {syllabus.modules.map((m, mi) => {
                const moduleLessons = lessons.filter((l) => l.moduleIndex === mi);
                const done = moduleLessons.filter((l) => completedSet.has(l.index)).length;
                const allDone = moduleLessons.length > 0 && done === moduleLessons.length;
                const locked = mi > currentModuleIndex;
                const isCurrentModule = mi === currentModuleIndex;
                const open = openModules.includes(mi);

                return (
                  <div key={m.title} className="border-b border-slate-100 last:border-0">
                    <button
                      type="button"
                      onClick={() => toggleModule(mi, locked)}
                      aria-expanded={open && !locked}
                      className={"flex w-full items-center gap-3 px-4 py-3 text-left " + (locked ? "cursor-not-allowed" : "hover:bg-slate-50")}
                    >
                      <span
                        className={
                          "flex h-7 w-7 flex-none items-center justify-center rounded-full " +
                          (allDone
                            ? "bg-green-100 text-green-600"
                            : locked
                            ? "bg-slate-100 text-slate-400"
                            : "bg-brand-600 text-white")
                        }
                      >
                        {allDone ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        ) : locked ? (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v9H5z" />
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={"block truncate text-sm font-semibold " + (locked ? "text-slate-400" : "text-navy-800")}>
                          Module {mi + 1}: {m.title}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {done}/{moduleLessons.length} lessons
                          {isCurrentModule && !allDone ? " · in progress" : ""}
                        </span>
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={"flex-none text-slate-400 transition-transform " + (open && !locked ? "rotate-180" : "")}
                        aria-hidden="true"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>

                    {open && !locked ? (
                      <ul className="pb-2">
                        {moduleLessons.map((l) => {
                          const lessonDone = completedSet.has(l.index);
                          const active = l.index === current;
                          return (
                            <li key={l.index}>
                              <button
                                type="button"
                                onClick={() => goTo(l.index)}
                                className={"flex w-full items-center gap-3 py-2.5 pl-4 pr-4 text-left " + (active ? "bg-brand-50" : "hover:bg-slate-50")}
                              >
                                <span
                                  className={
                                    "flex h-6 w-6 flex-none items-center justify-center rounded-full " +
                                    (lessonDone
                                      ? "bg-green-100 text-green-600"
                                      : active
                                      ? "bg-brand-600 text-white"
                                      : "bg-slate-100 text-slate-400")
                                  }
                                >
                                  {lessonDone ? (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                  ) : (
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  )}
                                </span>
                                <span className="flex-none text-xs text-slate-400">{l.lessonIndex + 1}.</span>
                                <span className={"min-w-0 flex-1 truncate text-sm " + (active ? "font-semibold text-brand-700" : "text-slate-700")}>
                                  {l.title}
                                </span>
                                <span className="flex-none text-xs text-slate-400">{l.duration}</span>
                                <span className="flex h-4 w-4 flex-none items-center justify-center">
                                  {lessonDone ? (
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="text-green-600" aria-hidden="true">
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                  ) : (
                                    <span className="block h-4 w-4 rounded-full border border-slate-300" />
                                  )}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function bestMatch(query: string, bank: QA[]): QA | null {
  const words = query.toLowerCase().match(/[a-z0-9]+/g) || [];
  if (!words.length) return null;
  let best: QA | null = null;
  let bestScore = 0;
  for (const qa of bank) {
    const hay = (qa.question + " " + qa.answer + " " + qa.explanation).toLowerCase();
    let score = 0;
    for (const w of words) {
      if (w.length > 2 && hay.includes(w)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = qa;
    }
  }
  return bestScore > 0 ? best : null;
}

function ProfessorAvatar() {
  return (
    <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-brand-600 text-white">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3 2 8l10 5 10-5-10-5Z" />
        <path d="M6 10.5V15c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" />
        <path d="M22 8v5" />
      </svg>
    </span>
  );
}
