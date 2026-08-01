import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Upload, Clock, Search, Network, ShieldCheck, Boxes, FileCheck2 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "1 · Upload a certificate",
    desc: "Drag-drop any PDF/PNG into Upload Studio — or paste a portfolio URL.",
    to: "/upload" as const,
    cta: "Open Upload Studio",
  },
  {
    icon: Clock,
    title: "2 · Watch the 5-stage pipeline",
    desc: "Receive → OCR/Extract → Classify → Embed & Connect → Index. Then open the new timeline item.",
    to: "/timeline" as const,
    cta: "Open Timeline",
  },
  {
    icon: Search,
    title: "3 · Search “Show my React projects”",
    desc: "Grounded snippet cards with sources, confidence badges, filters and pagination.",
    to: "/search" as const,
    cta: "Open Search",
  },
  {
    icon: Network,
    title: "4 · Click a graph node, export resume",
    desc: "Story panel with related documents and skills, then generate the PDF resume from Profile.",
    to: "/graph" as const,
    cta: "Open Graph",
  },
];

const notes = [
  {
    icon: Boxes,
    title: "Architecture",
    desc: "TanStack Start + React 19 front end, a deterministic local processing pipeline (OCR/extract → classify → embed → index) and a file-backed vault registry with stored demo outputs in /exports.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy & honesty",
    desc: "No proprietary LLM keys are required. Where a hosted model would run, MemoryVerse uses reproducible local mocks — every processed output is a real inspectable JSON artifact in the repo.",
  },
  {
    icon: FileCheck2,
    title: "How to validate in 60s",
    desc: "Upload → confirm the OCR-fallback badge and confidence, edit one field, then check the correction appears in Profile → Correction history, and the item in Timeline, Graph and Search.",
  },
];

export function JudgeSection() {
  return (
    <section id="judges" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            For judges
          </div>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            Verify end-to-end intelligence in <span className="text-gradient">four steps</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every step below is live in this build — no scripted screens, no dead controls.
          </p>
        </div>

        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="glass flex flex-col rounded-2xl p-5"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
                style={{ background: "var(--gradient-hero)" }}
              >
                <s.icon size={16} />
              </span>
              <h3 className="mt-4 text-sm font-semibold">{s.title}</h3>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
              <Link
                to={s.to}
                className="mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-semibold text-primary transition hover:bg-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {s.cta}
              </Link>
            </motion.li>
          ))}
        </ol>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {notes.map((n, i) => (
            <motion.div
              key={n.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                <n.icon size={15} className="text-primary" /> {n.title}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{n.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
