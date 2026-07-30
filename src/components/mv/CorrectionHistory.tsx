import { motion, AnimatePresence } from "framer-motion";
import { History, ThumbsUp, ThumbsDown, Pencil, Trash2 } from "lucide-react";
import { useCorrections, clearCorrections, wordDiff, type CorrectionEntry } from "@/lib/mv-store";

const kindMeta = {
  edit: { icon: Pencil, label: "OCR edit", tone: "text-primary bg-primary/10" },
  up: { icon: ThumbsUp, label: "Marked accurate", tone: "text-emerald-700 bg-emerald-500/15" },
  down: { icon: ThumbsDown, label: "Marked inaccurate", tone: "text-red-700 bg-red-500/15" },
} as const;

function timeAgo(ts: number) {
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  return new Date(ts).toLocaleString();
}

function Diff({ entry }: { entry: CorrectionEntry }) {
  if (entry.kind !== "edit") return null;
  const { removed, added } = wordDiff(entry.before, entry.after);
  return (
    <div className="mt-2 space-y-1 text-[11px]">
      <div className="rounded-lg bg-red-500/10 px-2 py-1 text-red-700">
        <span className="mr-1 font-semibold uppercase tracking-wider text-[9px]">before</span>
        <span className="line-through decoration-red-500/50">{entry.before || "—"}</span>
      </div>
      <div className="rounded-lg bg-emerald-500/10 px-2 py-1 text-emerald-800">
        <span className="mr-1 font-semibold uppercase tracking-wider text-[9px]">after</span>
        {entry.after || "—"}
      </div>
      {(removed.length > 0 || added.length > 0) && (
        <div className="flex flex-wrap gap-1 pt-0.5 text-[10px] text-muted-foreground">
          {removed.map((w, i) => (
            <span key={`r${i}`} className="rounded bg-red-500/10 px-1 line-through">{w}</span>
          ))}
          {added.map((w, i) => (
            <span key={`a${i}`} className="rounded bg-emerald-500/10 px-1 font-semibold">{w}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export function CorrectionHistory({ compact = false }: { compact?: boolean }) {
  const entries = useCorrections();

  return (
    <section aria-label="Correction history" className="glass rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          <History size={11} /> Correction history
          <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
            {entries.length}
          </span>
        </div>
        {entries.length > 0 && (
          <button
            onClick={clearCorrections}
            className="inline-flex items-center gap-1 rounded-lg bg-white/60 px-2 py-1 text-[10px] font-semibold text-muted-foreground hover:bg-white hover:text-foreground"
          >
            <Trash2 size={10} /> Clear
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Rate or correct an extracted field and every change lands here with timestamps and a before/after diff.
        </p>
      ) : (
        <div className={compact ? "max-h-[260px] space-y-2 overflow-y-auto pr-1" : "space-y-2"}>
          <AnimatePresence initial={false}>
            {entries.map((e) => {
              const meta = kindMeta[e.kind];
              const Icon = meta.icon;
              return (
                <motion.article
                  key={e.id}
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl bg-white/60 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${meta.tone}`}>
                        <Icon size={11} />
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-[12px] font-semibold">
                          {e.field} <span className="font-normal text-muted-foreground">· {e.itemName}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">{meta.label}</div>
                      </div>
                    </div>
                    <time className="shrink-0 text-[10px] text-muted-foreground" dateTime={new Date(e.at).toISOString()}>
                      {timeAgo(e.at)}
                    </time>
                  </div>
                  <Diff entry={e} />
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
