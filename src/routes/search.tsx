import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/mv/AppShell";
import { Search, FileText, Award, Briefcase, Code2, GraduationCap } from "lucide-react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Semantic Search — MemoryVerse AI" },
      { name: "description", content: "Ask in plain English. Find the memory, not just the file." },
      { property: "og:title", content: "Semantic Search — MemoryVerse AI" },
      { property: "og:description", content: "Natural language search across every document you own." },
    ],
  }),
  component: SearchPage,
});

type Category = "All" | "Certificates" | "Projects" | "Internships" | "Resumes" | "Academics";

interface Item {
  title: string;
  meta: string;
  category: Exclude<Category, "All">;
  icon: typeof Award;
  tint: string;
}

const items: Item[] = [
  { title: "Stanford Machine Learning Certificate", meta: "Coursera · 2024 · Grade A", category: "Certificates", icon: Award, tint: "var(--amber)" },
  { title: "AWS Cloud Practitioner Certificate", meta: "Amazon · 2023 · Verified", category: "Certificates", icon: Award, tint: "var(--amber)" },
  { title: "Capstone: MemoryVerse AI", meta: "React · Next.js · LLM · 2024", category: "Projects", icon: Code2, tint: "var(--mint)" },
  { title: "Realtime Chat App", meta: "React · WebSockets · 2023", category: "Projects", icon: Code2, tint: "var(--mint)" },
  { title: "Google Summer Internship Letter", meta: "Bangalore · 2024 · 12 weeks", category: "Internships", icon: Briefcase, tint: "var(--ice)" },
  { title: "Microsoft Winter Internship Letter", meta: "Hyderabad · 2023", category: "Internships", icon: Briefcase, tint: "var(--ice)" },
  { title: "Resume — Placement Ready v3", meta: "Updated 2 days ago · AI polished", category: "Resumes", icon: FileText, tint: "var(--rose)" },
  { title: "B.Tech Semester 6 Transcript", meta: "CGPA 9.1 · 2024", category: "Academics", icon: GraduationCap, tint: "var(--violet)" },
];

const examples = [
  "Show my AI certificates",
  "Find internship letters",
  "Show my React projects",
  "Display my latest resume",
];

export default function _() {}

function SearchPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category>("All");

  const results = useMemo(() => {
    const query = q.toLowerCase().trim();
    return items.filter((it) => {
      const inCat = cat === "All" || it.category === cat;
      if (!inCat) return false;
      if (!query) return true;
      const hay = `${it.title} ${it.meta} ${it.category}`.toLowerCase();
      // pseudo-semantic: allow keywords like "ai", "react", "intern", "resume"
      const tokens = query.split(/\s+/);
      return tokens.every((t) => hay.includes(t));
    });
  }, [q, cat]);

  const categories: Category[] = ["All", "Certificates", "Projects", "Internships", "Resumes", "Academics"];

  return (
    <AppShell
      eyebrow="Semantic Search"
      title={<>Ask anything. <span className="text-gradient">Find everything.</span></>}
      subtitle="Natural language across your entire memory vault — instant, private, human."
    >
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <div className="glass flex items-center gap-3 rounded-2xl p-3 shadow-[var(--shadow-glow)]">
          <Search size={18} className="ml-2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try: show my AI certificates from 2024…"
            className="flex-1 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={() => setQ(q)}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-white"
            style={{ background: "var(--gradient-hero)" }}
          >
            Search
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {examples.map((e) => (
            <button
              key={e}
              onClick={() => setQ(e)}
              className="glass rounded-full px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition hover:text-foreground"
            >
              {e}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[11px] font-semibold transition",
                cat === c ? "text-white shadow-md" : "glass text-muted-foreground hover:text-foreground",
              )}
              style={cat === c ? { background: "var(--gradient-hero)" } : undefined}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          <AnimatePresence>
            {results.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.button
                  key={r.title}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass flex w-full items-center gap-4 rounded-2xl p-4 text-left transition hover:-translate-y-0.5"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                    style={{ background: r.tint }}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{r.title}</div>
                    <div className="text-[11px] text-muted-foreground">{r.meta}</div>
                  </div>
                  <span className="hidden rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary sm:inline">
                    {r.category}
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
          {results.length === 0 && (
            <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
              No memories match. Try a broader phrase.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
