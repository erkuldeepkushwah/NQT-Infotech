// Course syllabus used by the student "My Courses" learning panel.
//
// The website's course catalogue (lib/site.ts) describes what a course is and
// what it costs. This file describes what is *inside* a course: its modules and
// the lessons within them, which is what the learning panel renders.
//
// There is no lesson-tracking backend yet, so the panel starts each course at
// `defaultCompleted` lessons and remembers the student's real progress in the
// browser (localStorage). When a lessons collection is added to Firestore, only
// the progress source in the page needs to change.

export type LessonType = "video" | "quiz" | "project";

export type Lesson = {
  title: string;
  duration: string;
  type: LessonType;
  description: string;
};

export type Module = {
  title: string;
  lessons: Lesson[];
};

export type Syllabus = {
  title: string;
  subtitle: string;
  modules: Module[];
  /** How many lessons are already done the first time the panel is opened. */
  defaultCompleted: number;
};

/** A lesson plus its position in the course, used for progress maths. */
export type FlatLesson = Lesson & {
  moduleIndex: number;
  lessonIndex: number;
  index: number;
};

function lesson(title: string, duration: string, type: LessonType = "video"): Lesson {
  return {
    title,
    duration,
    type,
    description:
      "A focused, hands-on walkthrough of " +
      title.toLowerCase() +
      ", with examples you can follow along and build on.",
  };
}

// ---------------------------------------------------------------------------
// Full Stack Web Development — the flagship course, with a full 8-module track.
// ---------------------------------------------------------------------------
const FULL_STACK: Syllabus = {
  title: "Full Stack Web Development",
  subtitle:
    "Learn to build modern web applications using HTML, CSS, JavaScript, React, Node.js and more.",
  defaultCompleted: 12,
  modules: [
    {
      title: "HTML & CSS",
      lessons: [
        lesson("Introduction to HTML", "10:15"),
        lesson("HTML Forms and Inputs", "12:40"),
        lesson("CSS Selectors and Properties", "14:05"),
        lesson("Layout with Flexbox", "16:30"),
        lesson("Responsive Design", "15:18"),
        lesson("Mini Project: Portfolio Page", "18:22", "project"),
      ],
    },
    {
      title: "JavaScript Fundamentals",
      lessons: [
        lesson("Introduction to JavaScript", "12:34"),
        lesson("Variables and Data Types", "15:20"),
        lesson("Functions in JavaScript", "14:18"),
        lesson("DOM Manipulation", "16:42"),
        lesson("Events and Event Handling", "13:56"),
        lesson("Fetch API and Promises", "17:33"),
        lesson("React Components & Props", "18:00"),
        lesson("React State & Lifecycle", "16:22"),
        lesson("Mini Project: To-Do App", "12:15", "project"),
      ],
    },
    {
      title: "React.js Essentials",
      lessons: [
        lesson("Introduction to React", "13:20"),
        lesson("JSX and Rendering", "15:45"),
        lesson("Hooks: useState and useEffect", "19:10"),
        lesson("Routing with React Router", "14:35"),
        lesson("State Management", "17:05"),
        lesson("Styling React Apps", "12:50"),
        lesson("Mini Project: Dashboard UI", "22:15", "project"),
      ],
    },
    {
      title: "Node.js & Express",
      lessons: [
        lesson("Introduction to Node.js", "12:50"),
        lesson("Modules and npm", "13:40"),
        lesson("Express Fundamentals", "16:05"),
        lesson("Building REST APIs", "18:25"),
        lesson("Middleware and Error Handling", "14:20"),
        lesson("Authentication with JWT", "17:15"),
        lesson("Mini Project: REST API", "21:00", "project"),
      ],
    },
    {
      title: "Databases & MongoDB",
      lessons: [
        lesson("Introduction to Databases", "11:30"),
        lesson("MongoDB Basics", "14:10"),
        lesson("Mongoose Models", "15:55"),
        lesson("CRUD Operations", "16:40"),
        lesson("Data Modelling", "13:25"),
        lesson("Mini Project: Notes API", "19:30", "project"),
      ],
    },
    {
      title: "Version Control with Git",
      lessons: [
        lesson("Git Basics", "10:20"),
        lesson("Branching and Merging", "13:45"),
        lesson("Pull Requests and Code Review", "12:15"),
        lesson("Resolving Conflicts", "11:40"),
        lesson("Mini Project: Team Workflow", "14:50", "project"),
      ],
    },
    {
      title: "Testing & Debugging",
      lessons: [
        lesson("Debugging Techniques", "12:30"),
        lesson("Unit Testing with Jest", "15:10"),
        lesson("Testing React Components", "14:45"),
        lesson("API Testing", "13:20"),
        lesson("Mini Project: Test Suite", "16:00", "project"),
      ],
    },
    {
      title: "Capstone Project",
      lessons: [
        lesson("Project Planning", "11:15"),
        lesson("Building the Backend", "20:30", "project"),
        lesson("Building the Frontend", "22:40", "project"),
        lesson("Deployment and Handover", "18:05", "project"),
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Every other course gets a sensible four-module track built from its title.
// ---------------------------------------------------------------------------
const DURATIONS = ["12:20", "14:05", "15:40", "13:15", "16:30", "11:50", "17:10"];

function genericSyllabus(title: string, subtitle: string): Syllabus {
  const build = (name: string, count: number, project: boolean): Module => ({
    title: name,
    lessons: Array.from({ length: count }, (_, i) =>
      lesson(
        name + " — Part " + (i + 1),
        DURATIONS[i % DURATIONS.length],
        project && i === count - 1 ? "project" : "video"
      )
    ),
  });

  return {
    title,
    subtitle,
    defaultCompleted: 0,
    modules: [
      build("Getting started", 4, false),
      build("Core concepts", 6, false),
      build("Advanced topics", 5, false),
      build("Hands-on project", 4, true),
    ],
  };
}

export function syllabusFor(title: string, subtitle: string): Syllabus {
  if (title === FULL_STACK.title) return FULL_STACK;
  return genericSyllabus(title, subtitle);
}

/** Flatten a syllabus into one ordered list of lessons. */
export function flatten(s: Syllabus): FlatLesson[] {
  const out: FlatLesson[] = [];
  s.modules.forEach((m, moduleIndex) => {
    m.lessons.forEach((l, lessonIndex) => {
      out.push({ ...l, moduleIndex, lessonIndex, index: out.length });
    });
  });
  return out;
}

export function totalLessons(s: Syllabus): number {
  return s.modules.reduce((n, m) => n + m.lessons.length, 0);
}

export function durationToSeconds(value: string): number {
  const [m, sec] = value.split(":").map((x) => parseInt(x, 10) || 0);
  return m * 60 + sec;
}

export function formatTime(total: number): string {
  const t = Math.max(0, Math.floor(total));
  const m = Math.floor(t / 60);
  const sec = t % 60;
  return m + ":" + String(sec).padStart(2, "0");
}
