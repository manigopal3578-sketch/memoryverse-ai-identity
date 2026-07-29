import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  UploadCloud,
  CheckCircle2,
  FileText,
  Sparkles,
  Tag,
  ScanText,
  Link2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const stages = ["Uploading", "OCR / Extract", "Classifying", "Linking", "Ready"] as const;

type Category = "Certificate" | "Resume" | "Internship" | "Project" | "Transcript" | "Portfolio";

interface ParsedFile {
  id: string;
  name: string;
  size: string;
  stage: number;
  confidence: number;
  category: Category;
  scanned: boolean;
  fields: { label: string; value: string }[];
  skills: string[];
  linked: string[];
}

const seed: ParsedFile[] = [
  {
    id: "1",
    name: "Google_Internship_Letter.pdf",
    size: "412 KB",
    stage: 4,
    confidence: 0.98,
    category: "Internship",
    scanned: false,
    fields: [
      { label: "Organization", value: "Google India" },
      { label: "Role", value: "Software Engineering Intern" },
      { label: "Duration", value: "12 weeks · Summer 2024" },
      { label: "Location", value: "Bangalore" },
    ],
    skills: ["React", "TypeScript", "System Design", "Code Review"],
    linked: ["MemoryVerse capstone", "Stanford ML certificate"],
  },
  {
    id: "2",
    name: "Hackathon_Winner_Cert.png",
    size: "1.2 MB",
    stage: 3,
    confidence: 0.91,
    category: "Certificate",
    scanned: true,
    fields: [
      { label: "Event", value: "HackCampus 2022" },
      { label: "Placement", value: "1st place" },
      { label: "Team size", value: "3" },
    ],
    skills: ["Rapid Prototyping", "Leadership"],
    linked: ["Realtime Chat App"],
  },
  {
    id: "3",
    name: "Capstone_Report_v2.pdf",
    size: "3.8 MB",
    stage: 2,
    confidence: 0.86,
    category: "Project",
    scanned: false,
    fields: [
      { label: "Project", value: "MemoryVerse AI" },
      { label: "Stack", value: "React · TypeScript · LLM · Vector DB" },
      { label: "Advisor", value: "Prof. R. Sharma" },
    ],
    skills: ["LLM Integration", "System Design", "Product"],
    linked: ["Google internship"],
  },
];

const guessCategory = (name: string): { category: Category; scanned: boolean } => {
  const n = name.toLowerCase();
  const scanned = /\.(png|jpg|jpeg|webp)$/.test(n);
  if (n.includes("intern")) return { category: "Internship", scanned };
  if (n.includes("cert") || n.includes("award")) return { category: "Certificate", scanned };
  if (n.includes("resume") || n.includes("cv")) return { category: "Resume", scanned };
  if (n.includes("transcript") || n.includes("marksheet")) return { category: "Transcript", scanned };
  if (n.includes("portfolio")) return { category: "Portfolio", scanned };
  return { category: "Project", scanned };
};

const catTint: Record<Category, string> = {
  Certificate: "var(--amber)",
  Resume: "var(--rose)",
  Internship: "var(--ice)",
  Project: "var(--mint)",
  Transcript: "var(--violet)",
  Portfolio: "var(--indigo)",
};

export function UploadStudio() {
  const [drag, setDrag] = useState(false);
  const [files, setFiles] = useState<ParsedFile[]>(seed);
  const [selected, setSelected] = useState<string>(seed[0].id);
  const timers = useRef<Record<string, ReturnType<typeof setInterval>>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const advance = useCallback((id: string) => {
    timers.current[id] = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.id !== id) return f;
          if (f.stage >= stages.length - 1) {
            clearInterval(timers.current[id]);
            return f;
          }
          return { ...f, stage: f.stage + 1, confidence: Math.min(0.99, f.confidence + 0.03) };
        }),
      );
    }, 900);
  }, []);

  useEffect(() => () => Object.values(timers.current).forEach(clearInterval), []);

  const addFiles = useCallback(
    (list: File[]) => {
      const additions: ParsedFile[] = list.slice(0, 4).map((f, i) => {
        const g = guessCategory(f.name);
        return {
          id: `${Date.now()}-${i}`,
          name: f.name,
          size: `${Math.max(1, Math.round(f.size / 1024))} KB`,
          stage: 0,
          confidence: 0.62,
          category: g.category,
          scanned: g.scanned,
          fields: [
            { label: "Detected type", value: g.category },
            { label: "Source", value: g.scanned ? "Scanned image (OCR)" : "Native PDF text" },
            { label: "Uploaded", value: "Just now" },
          ],
          skills: ["Auto-tagging…"],
          linked: ["Analysing links…"],
        };
      });
      setFiles((prev) => [...additions, ...prev].slice(0, 8));
      if (additions[0]) setSelected(additions[0].id);
      additions.forEach((a) => advance(a.id));
    },
    [advance],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles],
  );

  const active = files.find((f) => f.id === selected) ?? files[0];

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2 space-y-4">
        <motion.div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          animate={{ scale: drag ? 1.02 : 1 }}
          className="glass relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl p-8 text-center focus:outline-none"
          style={{
            borderColor: drag ? "oklch(0.55 0.26 295)" : undefined,
            boxShadow: drag ? "var(--shadow-glow)" : undefined,
          }}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))}
          />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-white"
            style={{ background: "var(--gradient-hero)" }}
          >
            <UploadCloud size={28} />
          </motion.div>
          <div>
            <div className="text-base font-semibold">Drop anything, anywhere</div>
            <p className="mt-1 text-xs text-muted-foreground">
              PDFs, images, DOCX, transcripts, portfolio links — parsed with confidence in seconds.
            </p>
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            PDF · PNG · JPG · DOCX · TXT · URL
          </div>
        </motion.div>

        <div className="glass rounded-2xl p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Vault queue
            </div>
            <div className="text-[10px] text-muted-foreground">{files.length} items</div>
          </div>
          <div className="max-h-[280px] space-y-2 overflow-y-auto pr-1">
            {files.map((f) => {
              const pct = ((f.stage + 1) / stages.length) * 100;
              const done = f.stage === stages.length - 1;
              const isSel = f.id === selected;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelected(f.id)}
                  className={cn(
                    "group w-full rounded-xl p-3 text-left transition",
                    isSel ? "bg-primary/10 ring-1 ring-primary/40" : "bg-white/60 hover:bg-white",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-white shrink-0"
                      style={{ background: done ? "oklch(0.65 0.18 155)" : catTint[f.category] }}
                    >
                      {done ? <CheckCircle2 size={16} /> : f.scanned ? <ScanText size={16} /> : <FileText size={16} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-semibold">{f.name}</div>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <span>{stages[f.stage]}</span>
                        <span>·</span>
                        <span>{f.size}</span>
                        {f.scanned && <span className="rounded bg-amber-500/15 px-1 py-0.5 font-semibold text-amber-700">OCR</span>}
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-muted-foreground">{Math.round(pct)}%</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-black/5">
                    <motion.div
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: "var(--gradient-hero)" }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lg:col-span-3">
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Preview · {stages[active.stage]}
                  </div>
                  <h3 className="mt-1 truncate font-display text-2xl">{active.name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="rounded-full px-2 py-0.5 font-semibold text-white" style={{ background: catTint[active.category] }}>
                      {active.category}
                    </span>
                    <span>· {active.size}</span>
                    {active.scanned && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 font-semibold text-amber-700">
                        <ScanText size={10} /> OCR fallback
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Confidence
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-display text-3xl text-gradient">
                      {Math.round(active.confidence * 100)}
                    </span>
                    <span className="text-xs text-muted-foreground">%</span>
                  </div>
                </div>
              </div>

              {/* pipeline steps */}
              <div className="mt-5 grid grid-cols-5 gap-2">
                {stages.map((s, i) => {
                  const done = i < active.stage;
                  const current = i === active.stage && active.stage < stages.length - 1;
                  const complete = i <= active.stage && active.stage === stages.length - 1;
                  return (
                    <div key={s} className="text-center">
                      <div
                        className={cn(
                          "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-semibold",
                          done || complete ? "text-white" : current ? "text-white" : "bg-black/5 text-muted-foreground",
                        )}
                        style={{
                          background: done || complete || current ? "var(--gradient-hero)" : undefined,
                        }}
                      >
                        {current ? <Loader2 size={12} className="animate-spin" /> : i + 1}
                      </div>
                      <div className="mt-1 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                        {s}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Extracted fields
                  </div>
                  <div className="space-y-2">
                    {active.fields.map((f) => (
                      <div key={f.label} className="rounded-xl bg-white/60 p-3">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.label}</div>
                        <div className="mt-0.5 text-sm font-semibold">{f.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      <Tag size={10} /> Auto-suggested tags
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {active.skills.map((s) => (
                        <span key={s} className="glass rounded-full px-2.5 py-1 text-[11px] font-semibold text-primary">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      <Link2 size={10} /> Linked memories
                    </div>
                    <div className="space-y-1.5">
                      {active.linked.map((l) => (
                        <div key={l} className="flex items-center gap-2 rounded-lg bg-white/60 px-3 py-1.5 text-[11px]">
                          <Sparkles size={11} className="text-primary" />
                          {l}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
