import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import heroAsset from "@/assets/memoryverse-hero.jpg.asset.json";
import { RippleDisplacementSlider } from "./RippleDisplacementSlider";
import { Folder } from "./Folder";
import { ItemDetailModal } from "./ItemDetailModal";
import { vaultItems, type VaultItem } from "@/lib/vault-data";

/** Three fixed preview boxes locked under the showcase: left / center / right. */
const previewIds = ["v1", "v3", "v5"] as const;

export function HeroShowcase() {
  const [open, setOpen] = useState<VaultItem | null>(null);
  const previews = previewIds
    .map((id) => vaultItems.find((v) => v.id === id))
    .filter(Boolean) as VaultItem[];

  return (
    <div className="relative">
      <div className="relative">
        <RippleDisplacementSlider
          image={heroAsset.url}
          alt="MemoryVerse AI — from scattered student files to a smart digital identity dashboard"
          aspect="aspect-[16/9]"
        />

        {/* Micro-action chip, bottom-right of the showcase */}
        <Link
          to="/search"
          className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-foreground/85 px-3 py-1.5 text-[11px] font-semibold text-background backdrop-blur transition hover:bg-foreground focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Sparkles size={11} /> Try a live query <ArrowUpRight size={11} />
        </Link>

        {/* Floating Folder card, overlapping bottom-left */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute -bottom-10 -left-4 z-10 hidden origin-bottom-left scale-[0.8] lg:block"
        >
          <div className="pointer-events-auto">
            <Folder />
          </div>
        </motion.div>
      </div>

      {/* Three locked preview boxes under the showcase */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:mt-14">
        {previews.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.button
              key={p.id}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
              whileHover={{ y: -4 }}
              onClick={() => setOpen(p)}
              aria-label={`Open details for ${p.title}`}
              className="glass flex items-center gap-3 rounded-2xl p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white"
                style={{ background: p.tint }}
              >
                <Icon size={15} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[12px] font-semibold">{p.title}</span>
                <span className="block truncate text-[10px] text-muted-foreground">
                  {p.category} · {Math.round(p.confidence * 100)}% confidence
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {open && <ItemDetailModal item={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </div>
  );
}
