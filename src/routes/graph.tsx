import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/mv/AppShell";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Briefcase, Code2, GraduationCap, Sparkles, FileText, ZoomIn, ZoomOut, RotateCcw, Filter, X, Link2, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useLibrary } from "@/lib/useLibrary";
import type { DocRecord } from "@/lib/library";

export const Route = createFileRoute("/graph")({
  validateSearch: (s: Record<string, unknown>): { skill?: string; node?: string } => ({
    skill: typeof s.skill === "string" ? s.skill : undefined,
    node: typeof s.node === "string" ? s.node : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Knowledge Graph — MemoryVerse AI" },
      { name: "description", content: "See how a certificate led to a skill led to a project led to you." },
      { property: "og:title", content: "Knowledge Graph — MemoryVerse AI" },
      { property: "og:description", content: "Every memory, quietly connected." },
    ],
  }),
  component: GraphPage,
});

type NodeKind = "cert" | "skill" | "project" | "intern" | "degree" | "ai";

interface N {
  id: string;
  label: string;
  kind: NodeKind;
  x: number;
  y: number;
  icon: typeof Award;
  tint: string;
  detail: string;
  documents: string[];
  skills: string[];
  story: string;
}

const demoNodes: N[] = [
  { id: "cert1", label: "Stanford ML", kind: "cert", x: 15, y: 20, icon: Award, tint: "var(--amber)", detail: "Coursera · 2024", documents: ["Stanford_ML_Cert.pdf", "Final_Project_Emotion.pdf"], skills: ["Python", "PyTorch", "ML Theory"], story: "A grade-A specialization that unlocked your fluency in ML fundamentals and led directly to your capstone." },
  { id: "cert2", label: "AWS Cloud", kind: "cert", x: 12, y: 55, icon: Award, tint: "var(--amber)", detail: "Amazon · 2023", documents: ["AWS_Cert.pdf"], skills: ["AWS", "Cloud", "Security"], story: "Your first cloud credential — the foundation for every deployed project since." },
  { id: "skill1", label: "React", kind: "skill", x: 38, y: 15, icon: Code2, tint: "var(--mint)", detail: "12 projects · 3 years", documents: ["ChatApp_Report.pdf", "Portfolio_v4.pdf"], skills: ["JSX", "Hooks", "State"], story: "Extracted from 12 documents; your most consistently demonstrated skill across projects and internships." },
  { id: "skill2", label: "Python / ML", kind: "skill", x: 35, y: 70, icon: Code2, tint: "var(--mint)", detail: "Extracted from 6 docs", documents: ["Stanford_ML_Cert.pdf", "Capstone_Report_v2.pdf"], skills: ["Python", "NumPy", "PyTorch"], story: "Traced through 6 documents — from coursework to capstone." },
  { id: "proj1", label: "MemoryVerse", kind: "project", x: 60, y: 30, icon: FileText, tint: "var(--rose)", detail: "Capstone · 2024", documents: ["Capstone_Report_v2.pdf", "MemoryVerse_Demo.mp4"], skills: ["LLM", "React", "Vector DB"], story: "Your capstone — cited in your Google recommendation letter and university showcase." },
  { id: "proj2", label: "Chat App", kind: "project", x: 58, y: 78, icon: FileText, tint: "var(--rose)", detail: "WebSockets · 2023", documents: ["ChatApp_Report.pdf", "ChatApp_Screens.png"], skills: ["React", "WebSockets", "Node.js"], story: "Shipped to 400 classmates — the project that opened the Microsoft door." },
  { id: "intern1", label: "Google", kind: "intern", x: 82, y: 20, icon: Briefcase, tint: "var(--ice)", detail: "Summer 2024", documents: ["Google_Internship_Letter.pdf", "Google_Rec_Letter.pdf"], skills: ["Search", "System Design"], story: "12 weeks in Bangalore. Recognized in the top-15% of interns, received a return offer." },
  { id: "intern2", label: "Microsoft", kind: "intern", x: 85, y: 55, icon: Briefcase, tint: "var(--ice)", detail: "Winter 2023", documents: ["Microsoft_Offer_Letter.pdf", "Microsoft_Completion_Cert.pdf"], skills: ["TypeScript", "Azure"], story: "Your first formal internship. Two PRs into Azure Data Studio and a strong-hire rating." },
  { id: "deg", label: "B.Tech CSE", kind: "degree", x: 50, y: 92, icon: GraduationCap, tint: "var(--violet)", detail: "CGPA 9.1", documents: ["Admission_Letter_IITR.pdf", "Transcript_Sem6.pdf"], skills: ["Algorithms", "Distributed Systems"], story: "The frame that holds it all together — 4 years, consistent excellence." },
  { id: "ai", label: "You", kind: "ai", x: 50, y: 50, icon: Sparkles, tint: "var(--indigo)", detail: "AI-composed identity", documents: ["Resume_v3.pdf"], skills: ["Builder", "Curious", "Kind"], story: "The living, AI-composed identity that stitches every memory into one honest story." },
];

const demoEdges: [string, string][] = [
  ["cert1", "skill2"], ["cert2", "skill1"], ["skill1", "proj1"], ["skill1", "proj2"],
  ["skill2", "proj1"], ["proj1", "intern1"], ["proj2", "intern2"], ["intern1", "ai"],
  ["intern2", "ai"], ["proj1", "ai"], ["deg", "ai"], ["cert1", "ai"],
];

const filters: { key: NodeKind | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "cert", label: "Certificates" },
  { key: "skill", label: "Skills" },
  { key: "project", label: "Projects" },
  { key: "intern", label: "Internships" },
];

const kindFor = (category: string): NodeKind => {
  if (/project/i.test(category)) return "project";
  if (/intern|experience/i.test(category)) return "intern";
  if (/academic|resume/i.test(category)) return "degree";
  return "cert";
};
const kindVisual: Record<NodeKind, { icon: typeof Award; tint: string }> = {
  cert: { icon: Award, tint: "var(--amber)" },
  skill: { icon: Code2, tint: "var(--mint)" },
  project: { icon: FileText, tint: "var(--rose)" },
  intern: { icon: Briefcase, tint: "var(--ice)" },
  degree: { icon: GraduationCap, tint: "var(--violet)" },
  ai: { icon: Sparkles, tint: "var(--indigo)" },
};

/** Build a personal knowledge graph from the signed-in student's documents. */
function graphFromDocs(docs: DocRecord[], name: string): { nodes: N[]; edges: [string, string][] } {
  const you: N = {
    id: "ai", label: name || "You", kind: "ai", x: 50, y: 50,
    icon: Sparkles, tint: "var(--indigo)", detail: "AI-composed identity",
    documents: docs.slice(0, 4).map((d) => d.file_name ?? d.title),
    skills: Array.from(new Set(docs.flatMap((d) => d.skills))).slice(0, 6),
    story: `Your identity, stitched from ${docs.length} verified document${docs.length === 1 ? "" : "s"}.`,
  };
  if (docs.length === 0) return { nodes: [you], edges: [] };

  const nodes: N[] = [you];
  const edges: [string, string][] = [];
  const skillIds = new Map<string, string>();

  docs.slice(0, 14).forEach((d, i, arr) => {
    const angle = (i / arr.length) * Math.PI * 2;
    const kind = kindFor(d.category);
    const visual = kindVisual[kind];
    const id = `doc-${d.id}`;
    nodes.push({
      id, label: d.title.length > 22 ? `${d.title.slice(0, 21)}…` : d.title, kind,
      x: 50 + Math.cos(angle) * 34, y: 50 + Math.sin(angle) * 34,
      icon: visual.icon, tint: visual.tint,
      detail: [d.issuer, d.doc_date].filter(Boolean).join(" · ") || d.category,
      documents: [d.file_name ?? d.title], skills: d.skills,
      story: d.snippet || d.extracted_text.slice(0, 180) || `${d.category} stored in your vault.`,
    });
    edges.push([id, "ai"]);

    d.skills.slice(0, 3).forEach((sk, j) => {
      let sid = skillIds.get(sk);
      if (!sid) {
        sid = `skill-${skillIds.size}`;
        skillIds.set(sk, sid);
        const a2 = angle + 0.18 * (j + 1);
        nodes.push({
          id: sid, label: sk, kind: "skill",
          x: 50 + Math.cos(a2) * 17, y: 50 + Math.sin(a2) * 17,
          icon: Code2, tint: "var(--mint)", detail: "Extracted skill",
          documents: [], skills: [sk],
          story: `Extracted by AI from your uploaded documents.`,
        });
        edges.push([sid, "ai"]);
      }
      edges.push([id, sid]);
    });
  });

  return { nodes, edges };
}

function GraphPage() {
  const { user, profile } = useAuth();
  const { docs } = useLibrary();
  const { nodes: allNodes, edges } = useMemo(
    () => (user ? graphFromDocs(docs, profile?.full_name || "You") : { nodes: demoNodes, edges: demoEdges }),
    [user, docs, profile?.full_name],
  );
  const { skill, node } = Route.useSearch();
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState<NodeKind | "all">("all");
  const [selected, setSelected] = useState<N | null>(null);

  useEffect(() => {
    if (node) {
      const n = allNodes.find((x) => x.id === node);
      if (n) setSelected(n);
    } else if (skill) {
      const n = allNodes.find((x) =>
        x.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase())) ||
        x.label.toLowerCase().includes(skill.toLowerCase()),
      );
      if (n) setSelected(n);
    }
  }, [node, skill, allNodes]);

  const skillMatches = useMemo(() => {
    if (!skill) return new Set<string>();
    return new Set(
      allNodes
        .filter((n) => n.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase())) || n.label.toLowerCase().includes(skill.toLowerCase()))
        .map((n) => n.id),
    );
  }, [skill, allNodes]);

  const visibleIds = useMemo(
    () => new Set(allNodes.filter((n) => filter === "all" || n.kind === filter || n.kind === "ai").map((n) => n.id)),
    [filter, allNodes],
  );
  const nodeMap = Object.fromEntries(allNodes.map((n) => [n.id, n]));

  const relatedIds = useMemo(() => {
    if (!selected) return new Set<string>();
    const set = new Set<string>([selected.id]);
    edges.forEach(([a, b]) => {
      if (a === selected.id) set.add(b);
      if (b === selected.id) set.add(a);
    });
    return set;
  }, [selected, edges]);

  const related = selected ? allNodes.filter((n) => relatedIds.has(n.id) && n.id !== selected.id) : [];
  const completeness = allNodes.length ? Math.round((visibleIds.size / allNodes.length) * 100) : 0;

  return (
    <AppShell
      eyebrow="Knowledge Graph"
      title={<>Every memory, <span className="text-gradient">quietly connected</span>.</>}
      subtitle="Click any node to inspect the story it belongs to."
    >
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={14} className="text-muted-foreground" />
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] font-semibold transition",
                  filter === f.key ? "text-white" : "glass text-muted-foreground hover:text-foreground",
                )}
                style={filter === f.key ? { background: "var(--gradient-hero)" } : undefined}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="glass rounded-full px-3 py-1.5 text-[11px] font-semibold text-primary">
              {completeness}% mapped
            </span>
            <button onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))} className="glass flex h-9 w-9 items-center justify-center rounded-xl" aria-label="Zoom out">
              <ZoomOut size={14} />
            </button>
            <span className="text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))} className="glass flex h-9 w-9 items-center justify-center rounded-xl" aria-label="Zoom in">
              <ZoomIn size={14} />
            </button>
            <button onClick={() => { setZoom(1); setFilter("all"); setSelected(null); }} className="glass flex h-9 items-center gap-1.5 rounded-xl px-3 text-[11px] font-semibold" aria-label="Reset">
              <RotateCcw size={12} /> Reset
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="glass relative h-[560px] w-full overflow-hidden rounded-3xl p-6 md:h-[680px]">
            <motion.div animate={{ scale: zoom }} transition={{ type: "spring", stiffness: 120, damping: 20 }} className="absolute inset-0 origin-center">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="edge2" x1="0" x2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.26 295)" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="oklch(0.82 0.11 225)" stopOpacity="0.7" />
                  </linearGradient>
                </defs>
                {edges.map(([a, b], i) => {
                  if (!visibleIds.has(a) || !visibleIds.has(b)) return null;
                  const highlight = selected && (a === selected.id || b === selected.id);
                  return (
                    <motion.line
                      key={i}
                      x1={nodeMap[a].x} y1={nodeMap[a].y}
                      x2={nodeMap[b].x} y2={nodeMap[b].y}
                      stroke={highlight ? "oklch(0.55 0.26 295)" : "url(#edge2)"}
                      strokeWidth={highlight ? 0.6 : 0.3}
                      strokeOpacity={selected && !highlight ? 0.2 : 1}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                    />
                  );
                })}
              </svg>
              {allNodes.filter((n) => visibleIds.has(n.id)).map((n, i) => {
                const Icon = n.icon;
                const isSel = selected?.id === n.id;
                const isRelated = selected && relatedIds.has(n.id) && !isSel;
                const dimmed = selected && !isSel && !isRelated;
                return (
                  <motion.button
                    key={n.id}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: dimmed ? 0.35 : 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.05, type: "spring", stiffness: 200 }}
                    onClick={() => setSelected(n)}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  >
                    <div className={cn("glass flex items-center gap-2 rounded-full px-3 py-1.5 shadow-md transition", isSel && "glow-ring scale-110", isRelated && "ring-1 ring-primary/40", skillMatches.has(n.id) && "ring-2 ring-amber-400")}>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full text-white" style={{ background: n.tint }}>
                        <Icon size={12} />
                      </span>
                      <span className="text-[11px] font-semibold">{n.label}</span>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          {/* side panel */}
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.aside
                key={selected.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass relative rounded-3xl p-6"
              >
                <button
                  onClick={() => setSelected(null)}
                  className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:text-foreground"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md" style={{ background: selected.tint }}>
                    <selected.icon size={16} />
                  </span>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-primary">{selected.kind}</div>
                    <div className="font-display text-xl leading-tight">{selected.label}</div>
                    <div className="text-[11px] text-muted-foreground">{selected.detail}</div>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{selected.story}</p>

                <div className="mt-5">
                  <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    <FileText size={10} /> Related documents
                  </div>
                  <div className="space-y-1.5">
                    {selected.documents.map((d) => (
                      <div key={d} className="flex items-center gap-2 rounded-lg bg-white/60 px-3 py-2 text-[11px]">
                        <FileText size={12} className="text-primary" />
                        <span className="truncate">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    <Tag size={10} /> Related skills
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.skills.map((s) => (
                      <span key={s} className="glass rounded-full px-2.5 py-1 text-[11px] font-semibold text-primary">{s}</span>
                    ))}
                  </div>
                </div>

                {related.length > 0 && (
                  <div className="mt-5">
                    <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      <Link2 size={10} /> Connected nodes
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {related.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => setSelected(n)}
                          className="glass inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold hover:text-primary"
                        >
                          <span className="h-2 w-2 rounded-full" style={{ background: n.tint }} />
                          {n.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.aside>
            ) : (
              <motion.aside
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass flex flex-col items-center justify-center rounded-3xl p-8 text-center"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  <Sparkles size={18} />
                </span>
                <div className="mt-3 text-sm font-semibold">Tap any node</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Explore the story, related documents and skills behind every memory.
                </p>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  );
}
