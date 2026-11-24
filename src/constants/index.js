// All the page copy lives here. **bold** and `code` inside a string are rendered
// by the helper in ../components/rich.jsx, so the data stays plain strings.

export const NAV = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

export const HERO = {
  name: "Andrei",
  tagline: "Software & AI Engineer. I build agents that run in production.",
  blurb:
    "Two years on the web platform and the AI layer at a logistics company — React, " +
    "Next.js and TypeScript on the front, GraphQL and Prisma on AWS behind it, and a " +
    "**LangGraph multi-agent workflow** that drafts contracts with a human in the loop. " +
    "Before that, Socialpoint and Ocado Technology.",
  stats: [
    { value: "2 yrs", note: "Full-time, shipping and on call" },
    { value: "C2", note: "English · native ES / CA" },
  ],
};

export const ABOUT =
  "I ship full-stack products and the agent workflows behind them, then run them in " +
  "production — bugs, incidents and all. Lately that means keeping LLM costs sane: " +
  "deterministic code wherever an agent is not needed, and routing each graph node to " +
  "the right model instead of the biggest one.";

export const JOBS = [
  {
    role: "Software & AI Engineer",
    company: "Estoko Logistics",
    when: "Dec 2024 — Nov 2026",
    bullets: [
      "Built a **LangGraph multi-agent workflow** in Python that drafts contracts and flags mismatches for human approval, cutting review hours and the risk of legal claims and absorbed costs.",
      "Cut infrastructure spend by optimising and refactoring the codebase.",
      "Kept LLM spend low with deterministic code where agents were not needed, and per-node model routing — cheaper models for simple steps, stronger ones for planning and orchestration.",
      "Designed and built the company API: **GraphQL/Apollo and Prisma on AWS** across SQL and NoSQL, plus MCP tools connecting LLMs to internal systems.",
      "Developed and ran the whole web platform in React, Next.js and TypeScript, from customer-facing pages to internal tools.",
      "Traced tool calls and logs with SigNoz and validated agent output with the people who use it.",
    ],
  },
  {
    role: "Full-Stack Developer Intern",
    company: "Socialpoint | Take-Two Interactive",
    when: "May 2023 — May 2024",
    bullets: [
      "Built features and internal tools used daily by game developers, QA and customer support.",
      "React/Redux UIs and backend endpoints, external API integrations, and tests on both ends (PHPUnit, React Testing Library).",
      "Docker, AWS, Terraform and LocalStack, in an agile sprint team.",
    ],
  },
  {
    role: "Engineer Apprentice",
    company: "Ocado Technology",
    when: "Oct 2022 — Feb 2023",
    bullets: [
      "Delivered tickets end to end on a microservices platform: implementation, testing, code review, deployment.",
      "Frontend in React, backend in Java and Spring Boot.",
    ],
  },
];

export const PROJECTS = [
  {
    name: "Orhideea",
    what:
      "A generative audio-visual instrument. Painting on the canvas is composing: " +
      "position maps to pitch, and every stroke plays as it is drawn. The canvas is " +
      "the piece, and it replays.",
    decision:
      "Notes quantize to a scale by default, so free clicking never sounds wrong. " +
      "Rendering is held to the 16.7 ms frame budget — a visual feature that costs " +
      "frame time, or changes how the instrument feels, gets reverted rather than " +
      "explained away.",
    tags: [
      { label: "pixijs", tone: "t-blue" },
      { label: "tone.js", tone: "t-green" },
      { label: "typescript", tone: "t-pink" },
      { label: "midi export", tone: "t-orange" },
    ],
    links: [
      { label: "Code", href: "https://github.com/popi0052/orhideea" },
      { label: "Live", href: "https://orhideea.vercel.app" },
    ],
  },
  {
    name: "stemtool",
    what:
      "Drop an audio file, get BPM and key straight away, then separate it into " +
      "vocals, drums, bass and other, and download the stems you tick.",
    decision:
      "TypeScript owns state, queue, API and UI; Python is a dumb binary that takes " +
      "`{in, out, preset}` and prints progress. One Python process stays alive across " +
      "jobs — loading a RoFormer checkpoint costs 5–20 s, and a queue would pay that " +
      "on every file.",
    tags: [
      { label: "typescript", tone: "t-blue" },
      { label: "node", tone: "t-green" },
      { label: "python", tone: "t-orange" },
      { label: "cuda", tone: "t-pink" },
    ],
    links: [{ label: "Code", href: "https://github.com/popi0052/stemtool" }],
    note: "Demo runs locally (needs a GPU)",
  },
];

// drawn as the rotating balls in the Stack section
export const SKILLS = [
  "TypeScript", "React", "Next.js", "Node", "Python", "GraphQL",
  "Prisma", "AWS", "Docker", "Terraform", "LangGraph", "MCP",
];

export const STACK = [
  { title: "Frontend", items: "React · Next.js · TypeScript · Tailwind CSS · Redux · three.js" },
  { title: "Backend & APIs", items: "Node.js · GraphQL (Apollo) · Prisma · REST · Python (FastAPI) · Java, Spring Boot" },
  { title: "AI & agents", items: "LangGraph · multi-agent workflows · tool calling · model routing · human-in-the-loop · MCP" },
  { title: "Cloud & data", items: "AWS · Docker · Terraform · SigNoz · SQL and NoSQL" },
  { title: "Testing", items: "Playwright · React Testing Library · PHPUnit · Git · Claude Code" },
  { title: "Education", items: "BSc Computer Engineering, UPC Barcelona — Software Engineering, FIB, 2024" },
];

export const CONTACT = {
  line: "Madrid, relocating. Fastest route is email — I answer within a day.",
  email: "eu.andreip@gmail.com",
  social: [
    { label: "GitHub", href: "https://github.com/popi0052" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/andrei-constantin-popa/" },
  ],
};
