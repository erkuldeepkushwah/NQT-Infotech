"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { enrolledSlugs, useMyEnrollments } from "@/lib/enrollments";
import { slugify } from "@/lib/slug";
import { courses as siteCourses } from "@/lib/site";
import {
  durationToSeconds,
  flatten,
  formatTime,
  syllabusFor,
  totalLessons,
} from "@/lib/syllabus";

const TASK_LABELS = ["Watch lesson video", "Review component notes", "Complete quick quiz"];
const TASK_MINUTES = [18, 5, 2];
const EST_MINUTES = TASK_MINUTES.reduce((a, b) => a + b, 0);

const CODE_LINES = [
  "import React from 'react';",
  "import Card from './components/Card';",
  "",
  "function App() {",
  "  return (",
  '    <div className="container">',
  "      <h1>Welcome to React</h1>",
  '      <Card title="Learning"',
  '        description="Build amazing apps" />',
  "    </div>",
  "  );",
  "}",
  "",
  "export default App;",
];

const KEYWORDS = ["import", "from", "function", "return", "export", "default", "const"];

export default function CourseLearningPage() {
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

  // Player state.
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [muted, setMuted] = useState(false);

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
  const durationSec = lesson ? durationToSeconds(lesson.duration) : 0;

  // Reset the player whenever the lesson changes.
  useEffect(() => {
    setPlaying(false);
    setTime(0);
  }, [current]);

  // Advance the (simulated) playhead while playing.
  useEffect(() => {
    if (!playing || durationSec <= 0) return;
    const id = window.setInterval(() => {
      setTime((t) => {
        const next = t + speed;
        if (next >= durationSec) {
          setPlaying(false);
          return durationSec;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [playing, durationSec, speed]);

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

          {/* Player */}
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-800 bg-[#0B1020] shadow-card">
            <div className="relative aspect-video w-full">
              <div className="grid h-full grid-cols-1 sm:grid-cols-2">
                <CodePane />
                <PreviewPane />
              </div>
              {!playing ? (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  aria-label="Play lesson"
                  className="absolute inset-0 flex items-center justify-center bg-black/10 transition hover:bg-black/20"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-brand-700 shadow-lg">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </button>
              ) : null}
            </div>

            <PlayerControls
              playing={playing}
              time={time}
              duration={durationSec}
              speed={speed}
              muted={muted}
              onTogglePlay={() => setPlaying((v) => !v)}
              onSeek={(ratio) => setTime(ratio * durationSec)}
              onSpeed={() => setSpeed((s) => (s === 1 ? 1.25 : s === 1.25 ? 1.5 : s === 1.5 ? 2 : 1))}
              onMute={() => setMuted((m) => !m)}
            />
          </div>

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
                  <path d="M3 5h18v11H3zM8 20h8M12 16v4" />
                </svg>
                {lesson.type === "project" ? "Project lesson" : lesson.type === "quiz" ? "Quiz lesson" : "Video lesson"}
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

// ---------------------------------------------------------------------------
// Mock lesson player — decorative, matching the course's code-and-preview look.
// ---------------------------------------------------------------------------
function highlight(text: string): ReactNode {
  const parts = text.split(/('[^']*'|"[^"]*")/g);
  return parts.map((part, i) => {
    if (/^['"]/.test(part)) {
      return (
        <span key={i} className="text-[#A5D6A7]">
          {part}
        </span>
      );
    }
    return part.split(/(\b\w+\b)/g).map((tok, j) =>
      KEYWORDS.includes(tok) ? (
        <span key={i + "-" + j} className="text-[#C792EA]">
          {tok}
        </span>
      ) : (
        <span key={i + "-" + j}>{tok}</span>
      )
    );
  });
}

function CodePane() {
  return (
    <div className="hidden h-full flex-col border-r border-slate-800 bg-[#0B1020] sm:flex">
      <div className="flex items-center gap-2 border-b border-slate-800 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-2 text-[11px] font-medium text-slate-400">App.jsx</span>
      </div>
      <div className="flex-1 overflow-hidden px-3 py-3">
        <pre className="font-mono text-[11px] leading-[1.65] text-slate-300 sm:text-xs">
          {CODE_LINES.map((line, i) => (
            <div key={i} className="flex gap-3">
              <span className="w-5 flex-none select-none text-right text-slate-600">{i + 1}</span>
              <code className="whitespace-pre">{line ? highlight(line) : "\u00A0"}</code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

function PreviewPane() {
  return (
    <div className="flex h-full flex-col bg-[#F1F5F9]">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-2">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        </span>
        <span className="ml-1 flex-1 rounded bg-slate-100 px-2 py-1 text-[10px] text-slate-500">
          localhost:5173
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-3 p-5">
        <h3 className="text-lg font-bold text-navy-800">Welcome to React</h3>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-navy-800">Learning</p>
          <p className="mt-0.5 text-xs text-slate-500">Build amazing apps</p>
        </div>
      </div>
    </div>
  );
}

function PlayerControls({
  playing,
  time,
  duration,
  speed,
  muted,
  onTogglePlay,
  onSeek,
  onSpeed,
  onMute,
}: {
  playing: boolean;
  time: number;
  duration: number;
  speed: number;
  muted: boolean;
  onTogglePlay: () => void;
  onSeek: (ratio: number) => void;
  onSpeed: () => void;
  onMute: () => void;
}) {
  const ratio = duration > 0 ? Math.min(1, time / duration) : 0;
  return (
    <div className="flex items-center gap-3 border-t border-slate-800 px-4 py-3">
      <button type="button" onClick={onTogglePlay} aria-label={playing ? "Pause" : "Play"} className="flex-none text-white">
        {playing ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <span className="flex-none font-mono text-[11px] text-slate-400">
        {formatTime(time)} / {formatTime(duration)}
      </span>

      <div
        className="group relative h-1.5 flex-1 cursor-pointer rounded-full bg-slate-700"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          onSeek(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)));
        }}
      >
        <div className="h-1.5 rounded-full bg-brand-500" style={{ width: ratio * 100 + "%" }} />
        <span
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white"
          style={{ left: "calc(" + ratio * 100 + "% - 6px)" }}
        />
      </div>

      <button type="button" onClick={onMute} aria-label={muted ? "Unmute" : "Mute"} className="flex-none text-slate-300 hover:text-white">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4V5Z" />
          {muted ? <path d="m17 9 4 6m0-6-4 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7" />}
        </svg>
      </button>

      <button type="button" onClick={onSpeed} className="flex-none font-mono text-[11px] text-slate-300 hover:text-white">
        {speed}x
      </button>

      <span className="flex-none text-slate-400" aria-hidden="true">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7.5 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3.6 14H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 7.5l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 3.6V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.5 1.5l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" />
        </svg>
      </span>

      <span className="flex-none text-slate-300" aria-hidden="true">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3" />
        </svg>
      </span>
    </div>
  );
}
