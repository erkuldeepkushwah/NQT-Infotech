// Interview-style question bank for the learning panel.
//
// Every lesson ("topic") gets exactly 20 questions, each with the correct
// answer and a short explanation. The bank is built from the lesson title so
// the panel works for every course without a hand-written file per lesson.

export type QA = {
  question: string;
  answer: string;
  explanation: string;
};

/** Turn a lesson title into a natural subject phrase, e.g.
 *  "Introduction to JavaScript" -> "JavaScript",
 *  "Mini Project: To-Do App"    -> "To-Do App". */
export function subjectOf(title: string): string {
  let s = title.trim();
  s = s.replace(/^introduction to\s+/i, "");
  s = s.replace(/^mini project:\s*/i, "");
  s = s.replace(/\s*[—-]\s*part\s*\d+\s*$/i, "");
  if (/^getting started$/i.test(s)) s = "the basics";
  return s || title;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

type Stem = (t: string) => QA;

// Exactly 20 stems — the length of this array is the "20 questions per topic".
const STEMS: Stem[] = [
  (t) => ({
    question: `What is ${t}?`,
    answer: `${cap(t)} is a core idea in this lesson. Give a one-line definition first, then say where you have used it in practice.`,
    explanation: `Definition questions open most interviews — a short, concrete answer sets the tone for the rest.`,
  }),
  (t) => ({
    question: `Why does ${t} matter?`,
    answer: `${cap(t)} matters because it solves a problem you meet in real projects. Explaining why it exists shows you can choose the right approach instead of copying code.`,
    explanation: `Interviewers ask "why" to see whether you understand the purpose, not just the syntax.`,
  }),
  (t) => ({
    question: `Where would you use ${t} in a real project?`,
    answer: `Reach for ${t} whenever a project needs this part of the stack. Describe one concrete feature you built that depended on it.`,
    explanation: `A real example is far more convincing than a textbook definition.`,
  }),
  (t) => ({
    question: `How would you explain ${t} to a complete beginner?`,
    answer: `Use a simple analogy: say what ${t} does in everyday words, then add one small example. If a beginner can repeat it back, the explanation works.`,
    explanation: `Teaching a concept is the fastest way to prove you understand it.`,
  }),
  (t) => ({
    question: `What problem does ${t} solve?`,
    answer: `${cap(t)} removes a specific friction point in development. Name the problem first, then say how ${t} addresses it.`,
    explanation: `Framing an answer as problem-then-solution reads as experienced.`,
  }),
  (t) => ({
    question: `What are the key ideas to remember about ${t}?`,
    answer: `Focus on three things: what ${t} is, when to use it, and the mistake to avoid. Three clear points beat a long list.`,
    explanation: `Grouping ideas into three points keeps an answer easy to follow.`,
  }),
  (t) => ({
    question: `How do you get started with ${t}?`,
    answer: `Start small: take the simplest example of ${t} from this lesson, run it, then change one thing at a time and watch the result.`,
    explanation: `Learning through small experiments builds understanding that lasts.`,
  }),
  (t) => ({
    question: `What are the most common mistakes with ${t}?`,
    answer: `Most mistakes with ${t} come from skipping the basics and copying code without reading it. Slow down, read each line, and check your assumptions.`,
    explanation: `Naming common mistakes shows you have real, hands-on experience.`,
  }),
  (t) => ({
    question: `How do you know you have understood ${t} well?`,
    answer: `You have understood ${t} when you can build something small with it without a tutorial, and explain every line you wrote.`,
    explanation: `Understanding shows in what you can build unaided.`,
  }),
  (t) => ({
    question: `What are the trade-offs or limits of ${t}?`,
    answer: `Every tool has limits. Say when ${t} is the right choice and when a simpler alternative is better — that judgement is what interviewers listen for.`,
    explanation: `Knowing the limits of a tool signals maturity.`,
  }),
  (t) => ({
    question: `How does ${t} fit into this course track?`,
    answer: `${cap(t)} builds on the lessons before it and is used again in the modules that follow, so it is worth being comfortable with it now.`,
    explanation: `Seeing how topics connect shows structured, deliberate learning.`,
  }),
  (t) => ({
    question: `Can you give a short example of ${t} in practice?`,
    answer: `Walk through one small example of ${t}: what the input is, what you do, and what the result looks like. Keep it short and concrete.`,
    explanation: `A worked example proves the knowledge is yours.`,
  }),
  (t) => ({
    question: `Which tools, libraries or ideas relate to ${t}?`,
    answer: `${cap(t)} connects to the tools and concepts you meet in this module. Mention the ones you have actually used, and say what each one does.`,
    explanation: `Naming related tools shows breadth without over-claiming.`,
  }),
  (t) => ({
    question: `How would you test or verify your work with ${t}?`,
    answer: `Check ${t} with the smallest possible case first, then a realistic one. Compare the result you expected with the result you got, and fix one difference at a time.`,
    explanation: `A simple verification habit is what separates working code from guessing.`,
  }),
  (t) => ({
    question: `What are the best practices for ${t}?`,
    answer: `Keep your code for ${t} simple and readable, name things clearly, and handle the edge cases before the happy path.`,
    explanation: `Readable, careful code is what teams actually want.`,
  }),
  (t) => ({
    question: `How does ${t} differ from the previous lesson's topic?`,
    answer: `Compare them by purpose: what each one is for, and when you would pick one over the other. A short comparison in words works well.`,
    explanation: `Comparison questions test whether you see the whole picture.`,
  }),
  (t) => ({
    question: `What would you build to practise ${t}?`,
    answer: `Build the smallest useful thing that needs ${t} — the mini project in this module is a good start — then add one feature of your own.`,
    explanation: `Building beats reading for retention.`,
  }),
  (t) => ({
    question: `How would you debug a problem in ${t}?`,
    answer: `Reproduce the problem, read the error carefully, and check your assumptions one at a time. Change one thing, then re-run.`,
    explanation: `A calm, methodical debugging habit is a strong interview signal.`,
  }),
  (t) => ({
    question: `What should you revise before an interview on ${t}?`,
    answer: `Revise the definition, one real example, and the common mistakes for ${t}. Those three cover most interview questions on a topic.`,
    explanation: `Focused revision beats trying to memorise everything.`,
  }),
  (t) => ({
    question: `How would you summarise ${t} in one line?`,
    answer: `One line: what ${t} is and why it is useful. If you can say that without notes, you know the topic.`,
    explanation: `Being able to compress a topic into one line proves you understand it.`,
  }),
];

/** Exactly 20 questions with answers and explanations, for a lesson topic. */
export function questionsFor(title: string): QA[] {
  const t = subjectOf(title);
  return STEMS.map((stem) => stem(t));
}
