import { motion } from "framer-motion";
import { Award, Briefcase, GraduationCap, FileText, Code2, Sparkles } from "lucide-react";

const nodes = [
  { id: "cert", label: "Certificate", icon: Award, x: 12, y: 20, tint: "var(--amber)" },
  { id: "skill", label: "React · Skill", icon: Code2, x: 42, y: 8, tint: "var(--mint)" },
  { id: "intern", label: "Internship", icon: Briefcase, x: 78, y: 22, tint: "var(--ice)" },
  { id: "project", label: "Capstone Project", icon: FileText, x: 30, y: 62, tint: "var(--rose)" },
  { id: "degree", label: "B.Tech Degree", icon: GraduationCap, x: 68, y: 70, tint: "var(--violet)" },
  { id: "ai", label: "AI Summary", icon: Sparkles, x: 50, y: 40, tint: "var(--indigo)" },
];

const edges: [string, string][] = [
  ["cert", "skill"],
  ["skill", "project"],
  ["skill", "intern"],
  ["project", "degree"],
  ["intern", "ai"],
  ["degree", "ai"],
  ["cert", "ai"],
];

export function KnowledgeGraph() {
  const map = Object.fromEntries(nodes.map((n) => [n.id, n]));
  return (
    <div className="glass relative aspect-[16/10] w-full overflow-hidden rounded-3xl p-6">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="edge" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.55 0.26 295)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="oklch(0.82 0.11 225)" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        {edges.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={map[a].x}
            y1={map[a].y}
            x2={map[b].x}
            y2={map[b].y}
            stroke="url(#edge)"
            strokeWidth={0.3}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.2 + i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </svg>
      {nodes.map((n, i) => {
        const Icon = n.icon;
        return (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 220, damping: 18 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
              className="glass flex items-center gap-2 rounded-full px-3 py-1.5 shadow-md"
            >
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-white"
                style={{ background: n.tint }}
              >
                <Icon size={12} />
              </span>
              <span className="text-[11px] font-medium text-foreground">{n.label}</span>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
