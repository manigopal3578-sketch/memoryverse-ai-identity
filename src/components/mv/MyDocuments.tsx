import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, FolderOpen, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useLibrary } from "@/lib/useLibrary";
import { SignedOutNotice } from "./AuthButton";
import { DocumentPreviewModal, categoryVisual } from "./DocumentPreviewModal";
import type { DocRecord } from "@/lib/library";

const CATEGORIES = ["All", "Certificates", "Resumes", "Projects", "Internships", "Academics", "Events"];

export function MyDocuments({ limit }: { limit?: number }) {
  const { user } = useAuth();
  const { docs, loading, removeLocal, upsertLocal } = useLibrary();
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<DocRecord | null>(null);

  const visible = useMemo(() => {
    const filtered = cat === "All" ? docs : docs.filter((d) => d.category === cat);
    return limit ? filtered.slice(0, limit) : filtered;
  }, [docs, cat, limit]);

  if (!user) return <SignedOutNotice what="keep every document forever" />;

  return (
    <section aria-label="My documents" className="glass rounded-2xl p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          <FolderOpen size={11} /> My document library
          <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
            {docs.length}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`rounded-lg px-2 py-1 text-[10px] font-semibold transition ${
                cat === c ? "bg-primary text-primary-foreground" : "bg-white/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 p-4 text-xs text-muted-foreground">
          <Loader2 size={13} className="animate-spin" /> Loading your vault…
        </div>
      ) : visible.length === 0 ? (
        <p className="p-2 text-xs text-muted-foreground">
          Nothing here yet — upload a certificate, resume, project report or internship letter and it
          will stay in your vault across sessions.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((d) => {
            const { icon: Icon, tint } = categoryVisual(d.category);
            return (
              <motion.div
                key={d.id}
                layout
                className="group flex items-center gap-3 rounded-xl bg-white/60 p-3 transition hover:bg-white"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
                  style={{ background: tint }}
                >
                  <Icon size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] font-semibold">{d.title}</div>
                  <div className="truncate text-[10px] text-muted-foreground">
                    {d.category} · {d.doc_date || new Date(d.created_at).toLocaleDateString()} ·{" "}
                    {Math.round(d.confidence * 100)}%
                  </div>
                </div>
                <button
                  onClick={() => setOpen(d)}
                  aria-label={`Preview ${d.title}`}
                  className="rounded-lg bg-white p-2 text-primary shadow-sm transition hover:scale-105"
                >
                  <Eye size={14} />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <DocumentPreviewModal
            doc={open}
            onClose={() => setOpen(null)}
            onDeleted={(id) => removeLocal(id)}
            onUpdated={(d) => { upsertLocal(d); setOpen(d); }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
