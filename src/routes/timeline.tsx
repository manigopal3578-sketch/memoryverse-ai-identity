import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/mv/AppShell";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Briefcase, Code2, GraduationCap, X, FileText, Sparkles, Tag, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/timeline")({
  validateSearch: (s: Record<string, unknown>): { skill?: string; event?: string } => ({
    skill: typeof s.skill === "string" ? s.skill : undefined,
    event: typeof s.event === "string" ? s.event : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Timeline — MemoryVerse AI" },
      { name: "description", content: "Your academic and professional journey, drawn as a beautiful story." },
      { property: "og:title", content: "Timeline — MemoryVerse AI" },
      { property: "og:description", content: "Your journey — one scrollable story of growth." },
    ],
  }),
  component: TimelinePage,
});

type Cat = "All" | "Academic" | "Projects" | "Internships" | "Awards";
interface Event {
  year: number;
  semester: 1 | 2;
  date: string;
  title: string;
  desc: string;
  category: Exclude<Cat, "All">;
  icon: typeof Award;
  tint: string;
  documents: { name: string; type: string }[];
  highlights: string[];
  skills: string[];
}

const events: Event[] = [
  {
    year: 2022, semester: 1, date: "Aug 2022", title: "Started B.Tech CSE",
    desc: "Joined engineering with a curious heart and a broken laptop.",
    category: "Academic", icon: GraduationCap, tint: "var(--violet)",
    documents: [
      { name: "Admission_Letter_IITR.pdf", type: "Official" },
      { name: "Fee_Receipt_Sem1.pdf", type: "Finance" },
    ],
    highlights: ["Ranked 384 in JEE Advanced", "Awarded merit-cum-means scholarship", "Enrolled in the CS honours track"],
    skills: ["C++", "Discrete Math"],
  },
  {
    year: 2022, semester: 2, date: "Dec 2022", title: "First hackathon win",
    desc: "Team of 3, 36 hours, one working prototype, one memory forever.",
    category: "Awards", icon: Award, tint: "var(--amber)",
    documents: [
      { name: "Hackathon_Winner_Cert.png", type: "Certificate" },
      { name: "Judges_Note.pdf", type: "Testimonial" },
    ],
    highlights: ["1st place — HackCampus 2022", "Built a live traffic-density app in 36 hours", "Interviewed by campus radio"],
    skills: ["React", "Firebase", "Rapid Prototyping"],
  },
  {
    year: 2023, semester: 1, date: "Mar 2023", title: "Realtime chat app",
    desc: "Shipped a WebSocket app used by 400 classmates.",
    category: "Projects", icon: Code2, tint: "var(--mint)",
    documents: [{ name: "Project_Report_ChatApp.pdf", type: "Report" }],
    highlights: ["400 daily active students in 3 weeks", "Sub-80ms message latency", "Open-sourced on GitHub · 210 stars"],
    skills: ["React", "WebSockets", "Node.js"],
  },
  {
    year: 2023, semester: 2, date: "Dec 2023", title: "Microsoft winter internship",
    desc: "6 weeks in Hyderabad. First stipend. First formal review.",
    category: "Internships", icon: Briefcase, tint: "var(--ice)",
    documents: [
      { name: "Microsoft_Offer_Letter.pdf", type: "Offer" },
      { name: "Microsoft_Completion_Cert.pdf", type: "Certificate" },
    ],
    highlights: ["Shipped 2 PRs into Azure Data Studio", "Received a strong-hire rating from manager", "Presented at intern demo day"],
    skills: ["TypeScript", "Azure", "Code Review"],
  },
  {
    year: 2024, semester: 1, date: "Apr 2024", title: "Stanford ML certificate",
    desc: "Completed with Grade A. First real taste of intelligence.",
    category: "Awards", icon: Award, tint: "var(--amber)",
    documents: [{ name: "Stanford_ML_Cert.pdf", type: "Certificate" }],
    highlights: ["Grade A across 11 assignments", "Final project: emotion classifier · 92% F1", "Peer-reviewed 20 submissions"],
    skills: ["Python", "PyTorch", "ML Theory"],
  },
  {
    year: 2024, semester: 2, date: "Jun 2024", title: "Google summer internship",
    desc: "12 weeks, Bangalore, one glowing recommendation letter.",
    category: "Internships", icon: Briefcase, tint: "var(--ice)",
    documents: [
      { name: "Google_Internship_Letter.pdf", type: "Offer" },
      { name: "Google_Rec_Letter.pdf", type: "Recommendation" },
      { name: "Intern_Presentation.pdf", type: "Deck" },
    ],
    highlights: ["Shipped a ranking-quality experiment to 1% traffic", "Recognized as a top-15% intern", "Received a return offer"],
    skills: ["Search", "System Design", "A/B Testing"],
  },
  {
    year: 2024, semester: 2, date: "Nov 2024", title: "Capstone: MemoryVerse AI",
    desc: "The project that convinced me I could build a company one day.",
    category: "Projects", icon: Code2, tint: "var(--mint)",
    documents: [
      { name: "Capstone_Report_v2.pdf", type: "Report" },
      { name: "MemoryVerse_Demo.mp4", type: "Demo" },
    ],
    highlights: ["Ingests any document with 96% classification confidence", "Semantic search across 1,200 seed documents", "Selected for university showcase"],
    skills: ["LLM Integration", "Vector Search", "Product"],
  },
];

function TimelinePage() {
  const [cat, setCat] = useState<Cat>("All");
  const [year, setYear] = useState<number | "All">("All");
  const [open, setOpen] = useState<Event | null>(null);

  const years = Array.from(new Set(events.map((e) => e.year))).sort();
  const cats: Cat[] = ["All", "Academic", "Projects", "Internships", "Awards"];

  const filtered = useMemo(
    () =>
      events.filter(
        (e) => (cat === "All" || e.category === cat) && (year === "All" || e.year === year),
      ),
    [cat, year],
  );

  return (
    <AppShell
      eyebrow="Timeline"
      title={<>Your journey, <span className="text-gradient">beautifully drawn</span>.</>}
      subtitle="Every semester, every project, every proof — placed on one calm, honest line."
    >
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] font-semibold transition",
                  cat === c ? "text-white" : "glass text-muted-foreground hover:text-foreground",
                )}
                style={cat === c ? { background: "var(--gradient-hero)" } : undefined}
              >
                {c}
              </button>
            ))}
          </div>
          <span className="text-muted-foreground/40">·</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setYear("All")}
              className={cn(
                "rounded-full px-3 py-1.5 text-[11px] font-semibold transition",
                year === "All" ? "text-white" : "glass text-muted-foreground hover:text-foreground",
              )}
              style={year === "All" ? { background: "var(--gradient-hero)" } : undefined}
            >
              All years
            </button>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] font-semibold transition",
                  year === y ? "text-white" : "glass text-muted-foreground hover:text-foreground",
                )}
                style={year === y ? { background: "var(--gradient-hero)" } : undefined}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-10">
          <div
            className="absolute left-5 top-0 h-full w-px md:left-1/2"
            style={{ background: "linear-gradient(to bottom, transparent, oklch(0.55 0.26 295 / 0.35), transparent)" }}
          />
          <div className="space-y-8">
            <AnimatePresence>
              {filtered.map((e, i) => {
                const Icon = e.icon;
                const side = i % 2 === 0;
                return (
                  <motion.button
                    key={e.title}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setOpen(e)}
                    className={cn(
                      "group relative flex w-full gap-4 text-left md:w-1/2",
                      side ? "md:pr-10" : "md:ml-auto md:pl-10",
                    )}
                  >
                    <div
                      className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-md md:absolute md:left-1/2 md:-translate-x-1/2"
                      style={{ background: e.tint }}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="glass w-full rounded-2xl p-5 transition group-hover:-translate-y-0.5">
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-primary">{e.date} · Sem {e.semester}</div>
                      <div className="mt-1 text-base font-semibold">{e.title}</div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{e.desc}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">{e.documents.length} docs</span>
                        <span>· {e.skills.length} skills extracted</span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Detailed drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(null)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              onClick={(ev) => ev.stopPropagation()}
              className="glass relative flex h-full w-full max-w-lg flex-col overflow-y-auto p-8"
            >
              <button
                onClick={() => setOpen(null)}
                className="absolute right-5 top-5 rounded-full p-1 text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X size={16} />
              </button>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md" style={{ background: open.tint }}>
                  <open.icon size={18} />
                </span>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-primary">{open.date} · Semester {open.semester}</div>
                  <h3 className="mt-0.5 font-display text-2xl leading-tight">{open.title}</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{open.desc}</p>

              <div className="mt-6">
                <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  <Sparkles size={10} /> AI-extracted highlights
                </div>
                <div className="space-y-2">
                  {open.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2 rounded-xl bg-primary/5 p-3 text-xs">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {h}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  <FileText size={10} /> Documents in this period
                </div>
                <div className="space-y-2">
                  {open.documents.map((d) => (
                    <div key={d.name} className="flex items-center gap-3 rounded-xl bg-white/60 p-3 text-xs">
                      <FileText size={13} className="text-primary" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold">{d.name}</div>
                        <div className="text-[10px] text-muted-foreground">{d.type}</div>
                      </div>
                      <Link2 size={12} className="text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  <Tag size={10} /> Skills extracted
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {open.skills.map((s) => (
                    <span key={s} className="glass rounded-full px-2.5 py-1 text-[11px] font-semibold text-primary">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-xl bg-primary/5 p-3 text-[11px] text-muted-foreground">
                AI-linked as a <span className="font-semibold text-primary">{open.category}</span> memory · verified · indexed
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
