import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/mv/AppShell";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Briefcase, Code2, GraduationCap, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/timeline")({
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
}

const events: Event[] = [
  { year: 2022, semester: 1, date: "Aug 2022", title: "Started B.Tech CSE", desc: "Joined engineering with a curious heart and a broken laptop.", category: "Academic", icon: GraduationCap, tint: "var(--violet)" },
  { year: 2022, semester: 2, date: "Dec 2022", title: "First hackathon win", desc: "Team of 3, 36 hours, one working prototype, one memory forever.", category: "Awards", icon: Award, tint: "var(--amber)" },
  { year: 2023, semester: 1, date: "Mar 2023", title: "Realtime chat app", desc: "Shipped a WebSocket app used by 400 classmates.", category: "Projects", icon: Code2, tint: "var(--mint)" },
  { year: 2023, semester: 2, date: "Dec 2023", title: "Microsoft winter internship", desc: "6 weeks in Hyderabad. First stipend. First formal review.", category: "Internships", icon: Briefcase, tint: "var(--ice)" },
  { year: 2024, semester: 1, date: "Apr 2024", title: "Stanford ML certificate", desc: "Completed with Grade A. First real taste of intelligence.", category: "Awards", icon: Award, tint: "var(--amber)" },
  { year: 2024, semester: 2, date: "Jun 2024", title: "Google summer internship", desc: "12 weeks, Bangalore, one glowing recommendation letter.", category: "Internships", icon: Briefcase, tint: "var(--ice)" },
  { year: 2024, semester: 2, date: "Nov 2024", title: "Capstone: MemoryVerse AI", desc: "The project that convinced me I could build a company one day.", category: "Projects", icon: Code2, tint: "var(--mint)" },
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
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-primary">{e.date}</div>
                      <div className="mt-1 text-base font-semibold">{e.title}</div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{e.desc}</p>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(ev) => ev.stopPropagation()}
              className="glass relative w-full max-w-md rounded-2xl p-8"
            >
              <button
                onClick={() => setOpen(null)}
                className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X size={16} />
              </button>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-primary">{open.date}</div>
              <h3 className="mt-2 font-display text-2xl">{open.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{open.desc}</p>
              <div className="mt-4 rounded-xl bg-primary/5 p-3 text-xs">
                AI-linked: <span className="font-semibold text-primary">{open.category}</span> memory · verified · indexed
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
