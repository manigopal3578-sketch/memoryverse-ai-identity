import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Cell {
  title: string;
  desc: string;
  icon: LucideIcon;
  span?: string;
  tone?: "violet" | "ice" | "mint" | "amber" | "rose";
  children?: ReactNode;
}

const toneBg: Record<NonNullable<Cell["tone"]>, string> = {
  violet: "linear-gradient(135deg, oklch(0.55 0.26 295 / 0.15), oklch(0.42 0.22 275 / 0.05))",
  ice: "linear-gradient(135deg, oklch(0.82 0.11 225 / 0.25), oklch(0.9 0.05 225 / 0.05))",
  mint: "linear-gradient(135deg, oklch(0.85 0.13 165 / 0.25), oklch(0.9 0.05 165 / 0.05))",
  amber: "linear-gradient(135deg, oklch(0.82 0.15 75 / 0.25), oklch(0.9 0.05 75 / 0.05))",
  rose: "linear-gradient(135deg, oklch(0.82 0.11 15 / 0.25), oklch(0.9 0.05 15 / 0.05))",
};

export function AgentBentoGrid({ cells }: { cells: Cell[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-3 md:auto-rows-[180px]">
      {cells.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className={cn(
              "glass group relative overflow-hidden rounded-2xl p-5",
              c.span,
            )}
            style={{
              background: c.tone
                ? `${toneBg[c.tone]}, color-mix(in oklab, white 70%, transparent)`
                : undefined,
            }}
          >
            <div className="flex items-start justify-between">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-md"
                style={{ background: "var(--gradient-hero)" }}
              >
                <Icon size={16} />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-base font-semibold text-foreground">{c.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.desc}</p>
            </div>
            {c.children && <div className="mt-4">{c.children}</div>}
            <div
              className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
              style={{ background: "var(--gradient-hero)" }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
