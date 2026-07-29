import { motion } from "framer-motion";
import { FileText, Award, Briefcase, GraduationCap, Sparkles } from "lucide-react";

const papers = [
  { icon: Award, label: "Hackathon Winner", tint: "var(--amber)", rot: -8 },
  { icon: GraduationCap, label: "B.Tech Transcript", tint: "var(--ice)", rot: 4 },
  { icon: Briefcase, label: "Internship @ Google", tint: "var(--mint)", rot: -3 },
  { icon: FileText, label: "Research Paper", tint: "var(--rose)", rot: 6 },
];

export function Folder({ open = true }: { open?: boolean }) {
  return (
    <div className="relative mx-auto h-[340px] w-[300px]">
      {/* Back of folder */}
      <div
        className="absolute inset-x-0 bottom-0 h-[240px] rounded-2xl"
        style={{
          background: "linear-gradient(160deg, oklch(0.55 0.26 295), oklch(0.42 0.22 275))",
          boxShadow: "var(--shadow-glow)",
        }}
      >
        <div className="absolute -top-3 left-6 h-6 w-24 rounded-t-xl"
          style={{ background: "oklch(0.55 0.26 295)" }} />
      </div>

      {/* Papers */}
      {papers.map((p, i) => {
        const Icon = p.icon;
        return (
          <motion.div
            key={p.label}
            initial={{ y: 20, opacity: 0, rotate: 0 }}
            animate={{
              y: open ? -60 - i * 14 : 0,
              opacity: 1,
              rotate: open ? p.rot : 0,
            }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -80 - i * 14, rotate: p.rot * 1.5, scale: 1.03 }}
            className="glass absolute left-1/2 top-1/2 flex h-24 w-56 -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-xl px-4"
            style={{ zIndex: 10 + i, borderColor: `color-mix(in oklab, ${p.tint} 40%, white)` }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white"
              style={{ background: p.tint }}
            >
              <Icon size={18} />
            </div>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold text-foreground">{p.label}</div>
              <div className="text-[10px] text-muted-foreground">Verified · AI parsed</div>
            </div>
          </motion.div>
        );
      })}

      {/* Front of folder */}
      <div
        className="absolute inset-x-0 bottom-0 h-[200px] rounded-2xl"
        style={{
          background: "linear-gradient(160deg, oklch(0.62 0.24 285), oklch(0.48 0.22 275))",
          boxShadow: "inset 0 2px 0 oklch(1 0 0 / 0.2), 0 30px 60px -20px oklch(0.42 0.22 275 / 0.55)",
        }}
      >
        <div className="flex items-center justify-between px-5 pt-4">
          <div className="flex items-center gap-2 text-white/90">
            <Sparkles size={14} />
            <span className="text-[11px] font-medium tracking-wide">MEMORY VAULT</span>
          </div>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white">
            AI · Live
          </span>
        </div>
      </div>
    </div>
  );
}
