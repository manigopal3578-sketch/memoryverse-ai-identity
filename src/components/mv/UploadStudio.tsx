import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState, lazy, Suspense } from "react";
import {
  UploadCloud,
  CheckCircle2,
  FileText,
  Sparkles,
  Tag,
  ScanText,
  Link2,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Pencil,
  X,
  Award,
  Calendar,
  Building2,
  Eye,
  Plus,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Globe,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { smartName, smartNameFromUrl, type SmartCategory } from "@/lib/smart-name";
import { toast } from "sonner";
import { logCorrection } from "@/lib/mv-store";
import { CorrectionHistory } from "./CorrectionHistory";

const DocumentViewer = lazy(() =>
  import("./DocumentViewer").then((m) => ({ default: m.DocumentViewer })),
);

const stages = ["Uploading", "OCR / Extract", "Classifying", "Linking", "Ready"] as const;

interface ExtractedField {
  label: string;
  value: string;
  feedback?: "up" | "down";
}

interface ParsedFile {
  id: string;
  name: string;
  displayName: string;
  source: "file" | "url";
  url?: string;
  size: string;
  stage: number;
  confidence: number;
  category: SmartCategory;
  scanned: boolean;
  issuer?: string;
  fields: ExtractedField[];
  skills: string[];
  linked: string[];
  body: string;
  highlights: { id: string; text: string; label: string }[];
  proofImage?: string;
}

const catIcon: Record<SmartCategory, typeof Award> = {
  Certificate: Award,
  Resume: FileText,
  Internship: Briefcase,
  Project: FolderGit2,
  Transcript: GraduationCap,
  Portfolio: Globe,
  Event: CalendarDays,
};

const catTint: Record<SmartCategory, string> = {
  Certificate: "var(--amber)",
  Resume: "var(--rose)",
  Internship: "var(--ice)",
  Project: "var(--mint)",
  Transcript: "var(--violet)",
  Portfolio: "var(--indigo)",
  Event: "var(--rose)",
};

const seedBody = (kind: SmartCategory, name: string) => {
  if (kind === "Certificate")
    return `This is to certify that the recipient successfully completed the program associated with ${name}. Skills demonstrated include React, TypeScript, and product thinking. Awarded with distinction after evaluation across three rigorous modules.`;
  if (kind === "Internship")
    return `Offer of internship for the role of Software Engineering Intern at ${name}. Duration: 12 weeks in Bangalore, working across React, TypeScript, and system design. Includes mentorship and a capstone review.`;
  return `Project overview for ${name}. Built with React, TypeScript, LLMs and a vector database. Focus areas include retrieval, ranking, and identity graph construction with sub-second latency.`;
};

const seedHighlights = (body: string) => {
  const picks = ["React", "TypeScript", "system design", "vector database", "Bangalore", "distinction"];
  return picks
    .filter((p) => body.includes(p))
    .map((p, i) => ({ id: `h${i}`, text: p, label: i === 0 ? "Skill" : i === 1 ? "Tech" : "Detail" }));
};

const seed: ParsedFile[] = [
  {
    id: "1",
    name: "Google_Internship_Letter.pdf",
    displayName: "Internship — Google",
    source: "file",
    size: "412 KB",
    stage: 4,
    confidence: 0.98,
    category: "Internship",
    scanned: false,
    issuer: "Google",
    fields: [
      { label: "Organization", value: "Google India" },
      { label: "Role", value: "Software Engineering Intern" },
      { label: "Duration", value: "12 weeks · Summer 2024" },
      { label: "Location", value: "Bangalore" },
    ],
    skills: ["React", "TypeScript", "System Design", "Code Review"],
    linked: ["MemoryVerse capstone", "Stanford ML certificate"],
    body: seedBody("Internship", "Google"),
    highlights: seedHighlights(seedBody("Internship", "Google")),
  },
  {
    id: "2",
    name: "Hackathon_Winner_Cert.png",
    displayName: "Certificate — Cipher AI",
    source: "file",
    size: "1.2 MB",
    stage: 4,
    confidence: 0.91,
    category: "Certificate",
    scanned: true,
    issuer: "HackCampus",
    fields: [
      { label: "Event", value: "HackCampus 2022" },
      { label: "Placement", value: "1st place" },
      { label: "Team size", value: "3" },
      { label: "Date", value: "Nov 12, 2022" },
    ],
    skills: ["Rapid Prototyping", "Leadership", "React"],
    linked: ["Realtime Chat App"],
    body: seedBody("Certificate", "Cipher AI Hackathon"),
    highlights: seedHighlights(seedBody("Certificate", "Cipher AI Hackathon")),
  },
];

export function UploadStudio() {
  const [drag, setDrag] = useState(false);
  const [files, setFiles] = useState<ParsedFile[]>(seed);
  const [selected, setSelected] = useState<string>(seed[0].id);
  const [showViewer, setShowViewer] = useState(false);
  const [detailFor, setDetailFor] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
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
          return { ...f, stage: f.stage + 1, confidence: Math.min(0.99, f.confidence + 0.05) };
        }),
      );
    }, 850);
  }, []);

  useEffect(() => () => Object.values(timers.current).forEach(clearInterval), []);

  const addFiles = useCallback(
    (list: File[]) => {
      const additions: ParsedFile[] = list.slice(0, 4).map((f, i) => {
        const sn = smartName(f.name);
        const body = seedBody(sn.category, sn.issuer ?? sn.title);
        return {
          id: `${Date.now()}-${i}`,
          name: f.name,
          displayName: sn.title,
          source: "file",
          size: `${Math.max(1, Math.round(f.size / 1024))} KB`,
          stage: 0,
          confidence: 0.62,
          category: sn.category,
          scanned: sn.scanned,
          issuer: sn.issuer,
          fields: [
            { label: "Detected type", value: sn.category },
            { label: "Issuer", value: sn.issuer ?? "Unknown" },
            { label: "Source", value: sn.scanned ? "Scanned image (OCR)" : "Native PDF text" },
            { label: "Uploaded", value: "Just now" },
          ],
          skills: ["Auto-tagging…"],
          linked: ["Analysing links…"],
          body,
          highlights: seedHighlights(body),
        };
      });
      setFiles((prev) => [...additions, ...prev].slice(0, 10));
      if (additions[0]) setSelected(additions[0].id);
      additions.forEach((a) => advance(a.id));
      if (additions[0]) toast.success("Named smartly", { description: additions[0].displayName });
    },
    [advance],
  );

  const addUrl = useCallback(() => {
    const url = urlInput.trim();
    if (!url) return;
    const sn = smartNameFromUrl(url);
    const body = seedBody(sn.category, sn.issuer ?? url);
    const item: ParsedFile = {
      id: `url-${Date.now()}`,
      name: url,
      displayName: sn.title,
      source: "url",
      url,
      size: "link",
      stage: 0,
      confidence: 0.58,
      category: sn.category,
      scanned: false,
      issuer: sn.issuer,
      fields: [
        { label: "Source URL", value: url },
        { label: "Host", value: sn.issuer ?? "" },
        { label: "Detected type", value: sn.category },
      ],
      skills: ["Fetching…"],
      linked: ["Resolving…"],
      body,
      highlights: seedHighlights(body),
    };
    setFiles((prev) => [item, ...prev].slice(0, 10));
    setSelected(item.id);
    setUrlInput("");
    advance(item.id);
    toast.success("Link imported", { description: sn.title });
  }, [urlInput, advance]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles],
  );

  const setFieldFeedback = (fileId: string, label: string, feedback: "up" | "down") => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? {
              ...f,
              fields: f.fields.map((fd) => (fd.label === label ? { ...fd, feedback } : fd)),
              confidence: Math.min(0.99, f.confidence + (feedback === "up" ? 0.01 : 0)),
            }
          : f,
      ),
    );
    const item = files.find((f) => f.id === fileId);
    const val = item?.fields.find((fd) => fd.label === label)?.value ?? "";
    logCorrection({ itemId: fileId, itemName: item?.displayName ?? fileId, field: label, kind: feedback, before: val, after: val });
    toast.success("Thanks — AI learning", {
      description: `Timeline, graph & search updated for ${label}.`,
    });
  };

  const editField = (fileId: string, label: string, value: string) => {
    const item = files.find((f) => f.id === fileId);
    const before = item?.fields.find((fd) => fd.label === label)?.value ?? "";
    if (before !== value) {
      logCorrection({ itemId: fileId, itemName: item?.displayName ?? fileId, field: label, kind: "edit", before, after: value });
      toast.success("Correction saved", { description: `${label} updated — timeline, graph & search refreshed.` });
    }
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? { ...f, fields: f.fields.map((fd) => (fd.label === label ? { ...fd, value, feedback: "up" } : fd)) }
          : f,
      ),
    );
  };

  const active = files.find((f) => f.id === selected) ?? files[0];
  const detail = detailFor ? files.find((f) => f.id === detailFor) : null;

  useEffect(() => {
    if (!detailFor) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetailFor(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detailFor]);



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
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Upload files: drop or click to select"
          animate={{ scale: drag ? 1.02 : 1 }}
          className="glass relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl p-8 text-center"
          style={{
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
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-white"
            style={{ background: "var(--gradient-hero)" }}
          >
            <UploadCloud size={24} />
          </motion.div>
          <div>
            <div className="text-sm font-semibold">Drop anything, anywhere</div>
            <p className="mt-1 text-xs text-muted-foreground">
              PDFs, images, DOCX, transcripts — smart-named on arrival.
            </p>
          </div>
        </motion.div>

        <div className="glass rounded-2xl p-4">
          <label htmlFor="mv-url" className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            <Link2 size={10} /> Import from URL
          </label>
          <div className="flex gap-2">
            <input
              id="mv-url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addUrl()}
              placeholder="github.com/you/project · linkedin.com/in/you · devfolio.co/…"
              className="flex-1 rounded-lg bg-white/70 px-3 py-2 text-xs placeholder:text-muted-foreground focus:bg-white"
            />
            <button
              onClick={addUrl}
              disabled={!urlInput.trim()}
              className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-40"
            >
              <Plus size={14} className="inline -mt-0.5" /> Fetch
            </button>
          </div>
        </div>

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
                <div key={f.id} className="flex items-stretch gap-1">
                  <button
                    onClick={() => setSelected(f.id)}
                    className={cn(
                      "flex-1 rounded-xl p-3 text-left transition",
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
                        <div className="truncate text-xs font-semibold">{f.displayName}</div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <span>{stages[f.stage]}</span>
                          <span>·</span>
                          <span className="truncate">{f.name}</span>
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
                  <button
                    onClick={() => setDetailFor(f.id)}
                    aria-label={`Open details for ${f.displayName}`}
                    className="rounded-xl bg-white/60 px-2 hover:bg-white"
                  >
                    <Eye size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-4">
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Preview · {stages[active.stage]}
                  </div>
                  <h3 className="mt-1 truncate font-display text-2xl">{active.displayName}</h3>
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
                <div className="flex flex-col items-end gap-2">
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
                  <button
                    onClick={() => setShowViewer((v) => !v)}
                    className="rounded-lg bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-primary/20"
                  >
                    {showViewer ? "Hide" : "Open"} document
                  </button>
                </div>
              </div>

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
                          done || complete || current ? "text-white" : "bg-black/5 text-muted-foreground",
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
                    Extracted fields · rate accuracy
                  </div>
                  <div className="space-y-2">
                    {active.fields.map((f) => {
                      const key = `${active.id}-${f.label}`;
                      const isEditing = editing === key;
                      return (
                        <div key={f.label} className="rounded-xl bg-white/60 p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                {f.label}
                              </div>
                              {isEditing ? (
                                <input
                                  autoFocus
                                  defaultValue={f.value}
                                  onBlur={(e) => {
                                    editField(active.id, f.label, e.target.value);
                                    setEditing(null);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      editField(active.id, f.label, (e.target as HTMLInputElement).value);
                                      setEditing(null);
                                    }
                                    if (e.key === "Escape") setEditing(null);
                                  }}
                                  className="mt-0.5 w-full rounded bg-white px-2 py-1 text-sm font-semibold"
                                />
                              ) : (
                                <div className="mt-0.5 text-sm font-semibold">{f.value}</div>
                              )}
                            </div>
                            <div className="flex items-center gap-0.5">
                              <button
                                aria-label="Mark accurate"
                                onClick={() => setFieldFeedback(active.id, f.label, "up")}
                                className={cn(
                                  "rounded p-1 transition",
                                  f.feedback === "up" ? "bg-emerald-500/20 text-emerald-700" : "text-muted-foreground hover:bg-black/5",
                                )}
                              >
                                <ThumbsUp size={12} />
                              </button>
                              <button
                                aria-label="Mark inaccurate"
                                onClick={() => setFieldFeedback(active.id, f.label, "down")}
                                className={cn(
                                  "rounded p-1 transition",
                                  f.feedback === "down" ? "bg-red-500/20 text-red-700" : "text-muted-foreground hover:bg-black/5",
                                )}
                              >
                                <ThumbsDown size={12} />
                              </button>
                              <button
                                aria-label="Edit field"
                                onClick={() => setEditing(key)}
                                className="rounded p-1 text-muted-foreground hover:bg-black/5"
                              >
                                <Pencil size={12} />
                              </button>
                            </div>
                          </div>
                          {f.feedback === "down" && !isEditing && (
                            <div className="mt-1.5 text-[10px] text-red-600">
                              Correction will retrain future extractions.
                            </div>
                          )}
                        </div>
                      );
                    })}
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

        <AnimatePresence>
          {showViewer && active && (
            <Suspense fallback={<div className="glass rounded-2xl p-6 text-xs text-muted-foreground">Loading viewer…</div>}>
              <DocumentViewer
                fileName={active.displayName}
                body={active.body}
                highlights={active.highlights}
                onClose={() => setShowViewer(false)}
              />
            </Suspense>
          )}
        </AnimatePresence>

        <CorrectionHistory compact />
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {detail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setDetailFor(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={`${detail.category} detail: ${detail.displayName}`}
              className="glass w-full max-w-2xl overflow-hidden rounded-3xl p-0"
            >
              <div
                className="relative flex items-center justify-between p-5 text-white"
                style={{ background: `linear-gradient(135deg, ${catTint[detail.category]}, var(--indigo))` }}
              >
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-widest opacity-80">{detail.category}</div>
                  <div className="truncate font-display text-2xl">{detail.displayName}</div>
                </div>
                <button
                  aria-label="Close details"
                  autoFocus
                  onClick={() => setDetailFor(null)}
                  className="rounded-lg bg-white/20 p-1.5 hover:bg-white/30"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto">
                <div className="grid gap-4 p-5 md:grid-cols-[180px_1fr]">
                  <div
                    className="flex h-40 items-center justify-center rounded-2xl text-white"
                    style={{ background: `linear-gradient(160deg, ${catTint[detail.category]}, oklch(0.42 0.22 275))` }}
                    role="img"
                    aria-label={`Proof image for ${detail.displayName}`}
                  >
                    {(() => {
                      const Icon = catIcon[detail.category];
                      return <Icon size={48} />;
                    })()}
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      {detail.issuer && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1">
                          <Building2 size={11} /> {detail.issuer}
                        </span>
                      )}
                      {detail.fields.find((f) => /date/i.test(f.label)) && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1">
                          <Calendar size={11} /> {detail.fields.find((f) => /date/i.test(f.label))?.value}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1">
                        <ScanText size={11} /> {detail.scanned ? "OCR from image" : "Native text"}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 font-semibold text-primary">
                        Confidence {Math.round(detail.confidence * 100)}%
                      </span>
                      {detail.url && (
                        <a
                          href={detail.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 underline"
                        >
                          <Link2 size={11} /> Open source link
                        </a>
                      )}
                    </div>

                    <div>
                      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Extracted fields · correct anything wrong
                      </div>
                      <div className="space-y-1.5">
                        {detail.fields.map((f) => {
                          const key = `detail-${detail.id}-${f.label}`;
                          const isEditing = editing === key;
                          return (
                            <div key={f.label} className="flex items-center gap-2 rounded-lg bg-white/60 px-2.5 py-1.5">
                              <div className="min-w-0 flex-1">
                                <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{f.label}</div>
                                {isEditing ? (
                                  <input
                                    autoFocus
                                    defaultValue={f.value}
                                    aria-label={`Correct ${f.label}`}
                                    onBlur={(e) => {
                                      editField(detail.id, f.label, e.target.value);
                                      setEditing(null);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        editField(detail.id, f.label, (e.target as HTMLInputElement).value);
                                        setEditing(null);
                                      }
                                      if (e.key === "Escape") {
                                        e.stopPropagation();
                                        setEditing(null);
                                      }
                                    }}
                                    className="mt-0.5 w-full rounded bg-white px-2 py-1 text-[12px] font-semibold"
                                  />
                                ) : (
                                  <div className="truncate text-[12px] font-semibold">{f.value}</div>
                                )}
                              </div>
                              <button
                                aria-label={`Mark ${f.label} accurate`}
                                onClick={() => setFieldFeedback(detail.id, f.label, "up")}
                                className={cn(
                                  "rounded p-1 transition",
                                  f.feedback === "up" ? "bg-emerald-500/20 text-emerald-700" : "text-muted-foreground hover:bg-black/5",
                                )}
                              >
                                <ThumbsUp size={12} />
                              </button>
                              <button
                                aria-label={`Mark ${f.label} inaccurate`}
                                onClick={() => setFieldFeedback(detail.id, f.label, "down")}
                                className={cn(
                                  "rounded p-1 transition",
                                  f.feedback === "down" ? "bg-red-500/20 text-red-700" : "text-muted-foreground hover:bg-black/5",
                                )}
                              >
                                <ThumbsDown size={12} />
                              </button>
                              <button
                                aria-label={`Edit ${f.label}`}
                                onClick={() => setEditing(key)}
                                className="rounded p-1 text-muted-foreground hover:bg-black/5"
                              >
                                <Pencil size={12} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Related skills &amp; tags
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {detail.skills.map((s) => (
                          <span key={s} className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                            {s}
                          </span>
                        ))}
                        <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-semibold">
                          #{detail.category.toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Extracted text · click a highlight to jump
                  </div>
                  <Suspense
                    fallback={<div className="rounded-2xl bg-white/60 p-4 text-xs text-muted-foreground">Loading viewer…</div>}
                  >
                    <DocumentViewer
                      fileName={detail.displayName}
                      body={detail.body}
                      highlights={detail.highlights}
                    />
                  </Suspense>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
