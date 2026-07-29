import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/mv/AppShell";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Award, Briefcase, Code2, GraduationCap, Sparkles, FileText, ZoomIn, ZoomOut, RotateCcw, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/graph")({
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
}

const allNodes: N[] = [
  { id: "cert1", label: "Stanford ML", kind: "cert", x: 15, y: 20, icon: Award, tint: "var(--amber)", detail: "Coursera · 2024" },
  { id: "cert2", label: "AWS Cloud", kind: "cert", x: 12, y: 55, icon: Award, tint: "var(--amber)", detail: "Amazon · 2023" },
  { id: "skill1", label: "React", kind: "skill", x: 38, y: 15, icon: Code2, tint: "var(--mint)", detail: "12 projects · 3 years" },
  { id: "skill2", label: "Python / ML", kind: "skill", x: 35, y: 70, icon: Code2, tint: "var(--mint)", detail: "Extracted from 6 docs" },
  { id: "proj1", label: "MemoryVerse", kind: "project", x: 60, y: 30, icon: FileText, tint: "var(--rose)", detail: "Capstone · 2024" },
  { id: "proj2", label: "Chat App", kind: "project", x: 58, y: 78, icon: FileText, tint: "var(--rose)", detail: "WebSockets · 2023" },
  { id: "intern1", label: "Google", kind: "intern", x: 82, y: 20, icon: Briefcase, tint: "var(--ice)", detail: "Summer 2024" },
  { id: "intern2", label: "Microsoft", kind: "intern", x: 85, y: 55, icon: Briefcase, tint: "var(--ice)", detail: "Winter 2023" },
  { id: "deg", label: "B.Tech CSE", kind: "degree", x: 50, y: 92, icon: GraduationCap, tint: "var(--violet)", detail: "CGPA 9.1" },
  { id: "ai", label: "You", kind: "ai", x: 50, y: 50, icon: Sparkles, tint: "var(--indigo)", detail: "AI-composed identity" },
];

const edges: [string, string][] = [
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

function GraphPage() {
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState<NodeKind | "all">("all");
  const [selected, setSelected] = useState<N | null>(null);

  const visibleIds = useMemo(
    () => new Set(allNodes.filter((n) => filter === "all" || n.kind === filter || n.kind === "ai").map((n) => n.id)),
    [filter],
  );
  const nodeMap = Object.fromEntries(allNodes.map((n) => [n.id, n]));

  return (
    <AppShell
      eyebrow="Knowledge Graph"
      title={<>Every memory, <span className="text-gradient">quietly connected</span>.</>}
      subtitle="Click any node to inspect the story it belongs to."
    >
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Filter size={14} className="mt-2 text-muted-foreground" />
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

        <div className="glass relative aspect-[16/10] w-full overflow-hidden rounded-3xl p-6">
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
                return (
                  <motion.line
                    key={i}
                    x1={nodeMap[a].x} y1={nodeMap[a].y}
                    x2={nodeMap[b].x} y2={nodeMap[b].y}
                    stroke="url(#edge2)" strokeWidth={0.3}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                  />
                );
              })}
            </svg>
            {allNodes.filter((n) => visibleIds.has(n.id)).map((n, i) => {
              const Icon = n.icon;
              const isSel = selected?.id === n.id;
              return (
                <motion.button
                  key={n.id}
                  initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05, type: "spring", stiffness: 200 }}
                  onClick={() => setSelected(n)}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                >
                  <div className={cn("glass flex items-center gap-2 rounded-full px-3 py-1.5 shadow-md transition", isSel && "glow-ring scale-110")}>
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

        {selected && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass mt-4 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: selected.tint }}>
                <selected.icon size={16} />
              </span>
              <div>
                <div className="text-sm font-semibold">{selected.label}</div>
                <div className="text-[11px] text-muted-foreground">{selected.detail}</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
