import { motion } from "framer-motion";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

export interface DockItem {
  icon: LucideIcon;
  label: string;
  color?: string;
}

export function GlassDock({ items }: { items: DockItem[] }) {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass-dark pointer-events-auto flex items-end gap-1 rounded-2xl px-3 py-2"
        style={{ boxShadow: "0 20px 60px -10px oklch(0 0 0 / 0.4)" }}
      >
        {items.map((it, i) => {
          const Icon = it.icon;
          const active = hover === i;
          return (
            <motion.button
              key={it.label}
              onHoverStart={() => setHover(i)}
              onHoverEnd={() => setHover(null)}
              animate={{ scale: active ? 1.25 : 1, y: active ? -8 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl text-white/80 hover:text-white"
              style={{
                background: active ? "var(--gradient-hero)" : "transparent",
              }}
            >
              <Icon size={18} />
              {active && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-9 whitespace-nowrap rounded-md bg-black/80 px-2.5 py-1 text-[11px] font-medium text-white shadow-lg"
                >
                  {it.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
