import { lazy, Suspense, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Building2, Calendar, Network, Clock, Sparkles, X } from "lucide-react";
import { buildHighlights, type VaultItem } from "@/lib/vault-data";

const DocumentViewer = lazy(() =>
  import("./DocumentViewer").then((m) => ({ default: m.DocumentViewer })),
);

export function ItemDetailModal({
  item,
  query = "",
  onClose,
}: {
  item: VaultItem;
  query?: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const highlights = buildHighlights(item, query);
  const Icon = item.icon;

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${item.category} detail: ${item.title}`}
        className="glass w-full max-w-2xl overflow-hidden rounded-3xl p-0"
      >
        <div
          className="flex items-center justify-between gap-3 p-5 text-white"
          style={{ background: `linear-gradient(135deg, ${item.tint}, var(--indigo))` }}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <Icon size={18} />
            </span>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-widest opacity-80">{item.category}</div>
              <div className="truncate font-display text-2xl">{item.title}</div>
            </div>
          </div>
          <button
            ref={closeRef}
            aria-label="Close details"
            onClick={onClose}
            className="rounded-lg bg-white/20 p-1.5 hover:bg-white/30"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5">
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1">
              <Building2 size={11} /> {item.issuer}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1">
              <Calendar size={11} /> {new Date(item.date).toLocaleDateString()}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-1 font-semibold text-emerald-700">
              <Sparkles size={11} /> Confidence {Math.round(item.confidence * 100)}%
            </span>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            {item.fields.map((f) => (
              <div key={f.label} className="rounded-xl bg-white/60 p-2.5">
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{f.label}</div>
                <div className="mt-0.5 text-[12px] font-semibold">{f.value}</div>
              </div>
            ))}
          </div>

          <div>
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Related skills — jump into the graph or timeline
            </div>
            <div className="flex flex-wrap gap-1.5">
              {item.skills.map((s) => (
                <span key={s} className="inline-flex overflow-hidden rounded-full bg-primary/10">
                  <Link
                    to="/graph"
                    search={{ skill: s }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-primary/20"
                  >
                    <Network size={10} /> {s}
                  </Link>
                  <Link
                    to="/timeline"
                    search={{ skill: s }}
                    aria-label={`Filter timeline by ${s}`}
                    className="inline-flex items-center border-l border-white/50 px-2 py-1 text-primary hover:bg-primary/20"
                  >
                    <Clock size={10} />
                  </Link>
                </span>
              ))}
              {item.graphNode && (
                <Link
                  to="/graph"
                  search={{ node: item.graphNode }}
                  className="inline-flex items-center gap-1 rounded-full bg-foreground px-2.5 py-1 text-[11px] font-semibold text-background"
                >
                  <Network size={10} /> Open in knowledge graph
                </Link>
              )}
              {item.timelineEvent && (
                <Link
                  to="/timeline"
                  search={{ event: item.timelineEvent }}
                  className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-semibold"
                >
                  <Clock size={10} /> Open timeline drawer
                </Link>
              )}
            </div>
          </div>

          <div>
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Extracted text · click a highlight to jump
            </div>
            <Suspense
              fallback={<div className="rounded-2xl bg-white/60 p-4 text-xs text-muted-foreground">Loading viewer…</div>}
            >
              <DocumentViewer fileName={item.title} body={item.body} highlights={highlights} />
            </Suspense>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
