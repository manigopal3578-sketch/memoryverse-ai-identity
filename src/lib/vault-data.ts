import { Award, Briefcase, Code2, FileText, GraduationCap } from "lucide-react";

export type VaultCategory = "Certificates" | "Projects" | "Internships" | "Resumes" | "Academics";

export interface VaultItem {
  id: string;
  title: string;
  meta: string;
  category: VaultCategory;
  icon: typeof Award;
  tint: string;
  snippet: string;
  tags: string[];
  skills: string[];
  confidence: number;
  date: string;
  issuer: string;
  body: string;
  /** graph node id this item maps to */
  graphNode?: string;
  /** timeline event title this item belongs to */
  timelineEvent?: string;
  fields: { label: string; value: string }[];
}

export const vaultItems: VaultItem[] = [
  {
    id: "v1",
    title: "Stanford Machine Learning Certificate",
    meta: "Coursera · 2024 · Grade A",
    category: "Certificates",
    icon: Award,
    tint: "var(--amber)",
    snippet:
      "…successfully completed the graduate-level ML specialization with distinction, covering supervised, unsupervised and reinforcement learning…",
    tags: ["ML", "Python", "Certificate"],
    skills: ["Python", "PyTorch", "ML Theory"],
    confidence: 0.98,
    date: "2024-04-12",
    issuer: "Coursera · Stanford",
    graphNode: "cert1",
    timelineEvent: "Stanford ML certificate",
    fields: [
      { label: "Issuer", value: "Stanford Online via Coursera" },
      { label: "Grade", value: "A · 11 assignments" },
      { label: "Date", value: "Apr 12, 2024" },
    ],
    body: "This is to certify that the recipient completed the Machine Learning specialization with Grade A. Coursework covered Python, PyTorch, supervised learning, unsupervised learning and reinforcement learning. The final project was an emotion classifier reaching 92% F1, peer-reviewed across 20 submissions.",
  },
  {
    id: "v2",
    title: "AWS Cloud Practitioner Certificate",
    meta: "Amazon · 2023 · Verified",
    category: "Certificates",
    icon: Award,
    tint: "var(--amber)",
    snippet: "…foundational understanding of AWS Cloud, security, architecture, pricing and support…",
    tags: ["Cloud", "AWS"],
    skills: ["AWS", "Cloud", "Security"],
    confidence: 0.94,
    date: "2023-08-02",
    issuer: "Amazon Web Services",
    graphNode: "cert2",
    fields: [
      { label: "Issuer", value: "Amazon Web Services" },
      { label: "Credential", value: "CLF-C02 · Verified" },
      { label: "Date", value: "Aug 2, 2023" },
    ],
    body: "Awarded for demonstrating a foundational understanding of AWS Cloud, security, architecture, pricing and support. Verified credential covering cloud deployment models and shared responsibility.",
  },
  {
    id: "v3",
    title: "Capstone: MemoryVerse AI",
    meta: "React · Next.js · LLM · 2024",
    category: "Projects",
    icon: Code2,
    tint: "var(--mint)",
    snippet:
      "…an AI-native personal identity vault that ingests, understands and connects every academic artifact into a single searchable graph…",
    tags: ["React", "LLM", "Vector DB"],
    skills: ["LLM Integration", "React", "Vector Search"],
    confidence: 0.96,
    date: "2024-11-10",
    issuer: "IIT Roorkee",
    graphNode: "proj1",
    timelineEvent: "Capstone: MemoryVerse AI",
    fields: [
      { label: "Type", value: "Capstone project" },
      { label: "Stack", value: "React · LLM · Vector DB" },
      { label: "Date", value: "Nov 10, 2024" },
    ],
    body: "An AI-native personal identity vault built with React, an LLM pipeline and a vector database. It ingests any document with 96% classification confidence, performs semantic search across 1,200 seed documents, and constructs an identity graph with sub-second latency. Selected for the university showcase.",
  },
  {
    id: "v4",
    title: "Realtime Chat App",
    meta: "React · WebSockets · 2023",
    category: "Projects",
    icon: Code2,
    tint: "var(--mint)",
    snippet: "…low-latency messaging system serving 400 concurrent classmates with typing indicators and message reactions…",
    tags: ["React", "WebSockets"],
    skills: ["React", "WebSockets", "Node.js"],
    confidence: 0.9,
    date: "2023-03-18",
    issuer: "Personal",
    graphNode: "proj2",
    timelineEvent: "Realtime chat app",
    fields: [
      { label: "Type", value: "Side project" },
      { label: "Scale", value: "400 daily active students" },
      { label: "Date", value: "Mar 18, 2023" },
    ],
    body: "A low-latency messaging system built with React, WebSockets and Node.js serving 400 concurrent classmates, with typing indicators and message reactions. Sub-80ms message latency, open-sourced on GitHub with 210 stars.",
  },
  {
    id: "v5",
    title: "Google Summer Internship Letter",
    meta: "Bangalore · 2024 · 12 weeks",
    category: "Internships",
    icon: Briefcase,
    tint: "var(--ice)",
    snippet: "…confirming the role of Software Engineering Intern with the Search Quality org from June to August 2024…",
    tags: ["Google", "SWE"],
    skills: ["Search", "System Design", "A/B Testing"],
    confidence: 0.99,
    date: "2024-06-01",
    issuer: "Google India",
    graphNode: "intern1",
    timelineEvent: "Google summer internship",
    fields: [
      { label: "Organization", value: "Google India" },
      { label: "Role", value: "Software Engineering Intern" },
      { label: "Date", value: "Jun 1, 2024" },
    ],
    body: "Offer of internship for the role of Software Engineering Intern with the Search Quality org in Bangalore, from June to August 2024. The intern shipped a ranking-quality experiment to 1% traffic, was recognized as a top-15% intern and received a return offer. Skills applied: System Design, A/B Testing.",
  },
  {
    id: "v6",
    title: "Microsoft Winter Internship Letter",
    meta: "Hyderabad · 2023",
    category: "Internships",
    icon: Briefcase,
    tint: "var(--ice)",
    snippet: "…contributed to Azure Data Studio extensions; delivered two production PRs and a hackathon prototype…",
    tags: ["Microsoft", "Cloud"],
    skills: ["TypeScript", "Azure", "Code Review"],
    confidence: 0.93,
    date: "2023-12-14",
    issuer: "Microsoft India",
    graphNode: "intern2",
    timelineEvent: "Microsoft winter internship",
    fields: [
      { label: "Organization", value: "Microsoft India" },
      { label: "Role", value: "Cloud Intern" },
      { label: "Date", value: "Dec 14, 2023" },
    ],
    body: "Confirmation of a six-week winter internship in Hyderabad. Contributed to Azure Data Studio extensions in TypeScript, delivered two production PRs, presented at intern demo day and received a strong-hire rating from the manager.",
  },
  {
    id: "v7",
    title: "Resume — Placement Ready v3",
    meta: "Updated recently · AI polished",
    category: "Resumes",
    icon: FileText,
    tint: "var(--rose)",
    snippet: "…AI-composed one-page resume highlighting Google, Microsoft, MemoryVerse, and 6 top skills ranked by evidence…",
    tags: ["Resume", "AI-polished"],
    skills: ["React", "TypeScript", "Product"],
    confidence: 0.97,
    date: "2026-07-27",
    issuer: "MemoryVerse AI",
    graphNode: "ai",
    fields: [
      { label: "Version", value: "v3 · AI polished" },
      { label: "Length", value: "1 page" },
      { label: "Date", value: "Jul 27, 2026" },
    ],
    body: "An AI-composed one-page resume highlighting Google, Microsoft and MemoryVerse, with 6 top skills ranked by evidence: React, TypeScript, Python, ML, System Design and Product.",
  },
  {
    id: "v8",
    title: "B.Tech Semester 6 Transcript",
    meta: "CGPA 9.1 · 2024",
    category: "Academics",
    icon: GraduationCap,
    tint: "var(--violet)",
    snippet: "…verified digital transcript with grades in Distributed Systems, Machine Learning, and Compiler Design…",
    tags: ["Academics", "Transcript"],
    skills: ["Algorithms", "Distributed Systems"],
    confidence: 0.99,
    date: "2024-05-20",
    issuer: "IIT Roorkee",
    graphNode: "deg",
    timelineEvent: "Started B.Tech CSE",
    fields: [
      { label: "Institution", value: "IIT Roorkee" },
      { label: "CGPA", value: "9.1" },
      { label: "Date", value: "May 20, 2024" },
    ],
    body: "Verified digital transcript with grades in Distributed Systems, Machine Learning and Compiler Design. Cumulative CGPA of 9.1 across six semesters of the CS honours track.",
  },
  {
    id: "v9",
    title: "GDG DevFest — Speaker Proof",
    meta: "Community · 2024",
    category: "Certificates",
    icon: Award,
    tint: "var(--amber)",
    snippet: "…delivered a 25-minute talk on building AI-native student products to an audience of 300+…",
    tags: ["Speaking", "Community"],
    skills: ["Public Speaking", "Product"],
    confidence: 0.88,
    date: "2024-10-05",
    issuer: "Google Developer Groups",
    graphNode: "ai",
    fields: [
      { label: "Event", value: "GDG DevFest 2024" },
      { label: "Role", value: "Speaker" },
      { label: "Date", value: "Oct 5, 2024" },
    ],
    body: "Certificate of appreciation for delivering a 25-minute talk on building AI-native student products to an audience of 300+ developers at GDG DevFest.",
  },
  {
    id: "v10",
    title: "Portfolio Site — v4",
    meta: "Personal · 2024",
    category: "Projects",
    icon: Code2,
    tint: "var(--mint)",
    snippet: "…lightweight portfolio built with TanStack Start; core web vitals green across mobile and desktop…",
    tags: ["Portfolio", "TanStack"],
    skills: ["React", "Performance", "Design"],
    confidence: 0.91,
    date: "2024-09-11",
    issuer: "Personal",
    graphNode: "skill1",
    fields: [
      { label: "Type", value: "Personal site" },
      { label: "Stack", value: "TanStack Start · React" },
      { label: "Date", value: "Sep 11, 2024" },
    ],
    body: "A lightweight portfolio built with TanStack Start and React. Core web vitals are green across mobile and desktop, with a focus on Performance and Design.",
  },
];

/** Build clickable highlight spans for a document body from a query + its skills. */
export function buildHighlights(item: VaultItem, query: string) {
  const tokens = Array.from(
    new Set(
      [...item.skills, ...item.tags, ...query.split(/\s+/).filter((t) => t.length > 2)].map((t) => t.trim()),
    ),
  ).filter(Boolean);

  return tokens
    .filter((t) => item.body.toLowerCase().includes(t.toLowerCase()))
    .map((t, i) => {
      const idx = item.body.toLowerCase().indexOf(t.toLowerCase());
      return {
        id: `hl-${i}`,
        text: item.body.slice(idx, idx + t.length),
        label: query && query.toLowerCase().includes(t.toLowerCase()) ? "Query match" : "Skill",
      };
    })
    .filter((h, i, arr) => arr.findIndex((x) => x.text === h.text) === i)
    .slice(0, 8);
}
