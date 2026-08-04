import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Award,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Code2,
  Download,
  FileText,
  GraduationCap,
  Network,
  Sparkles,
  Pencil,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { signedUrl, deleteDocument, updateDocument, type DocRecord } from "@/lib/library";
import { toast } from "sonner";

const DocumentViewer = lazy(() =>
  import("./DocumentViewer").then((m) => ({ default: m.DocumentViewer })),
);

const categoryMeta: Record<string, { icon: typeof Award; tint: string }> = {
  Certificates: { icon: Award, tint: "var(--amber)" },
  Projects: { icon: Code2, tint: "var(--mint)" },
  Internships: { icon: Briefcase, tint: "var(--ice)" },
  Resumes: { icon: FileText, tint: "var(--violet)" },
  Academics: { icon: GraduationCap, tint: "var(--rose)" },
  Events: { icon: Sparkles, tint: "var(--indigo)" },
};

export function categoryVisual(category: string) {
  return categoryMeta[category] ?? { icon: FileText, tint: "var(--violet)" };
}

function buildHighlights(doc: DocRecord, query: string) {
  const tokens = Array.from(
    new Set([...doc.skills, ...doc.tags, ...query.split(/\s+/).filter((t) => t.length > 2)]),
  ).filter(Boolean);
  return tokens
    .filter((t) => doc.extracted_text.toLowerCase().includes(t.toLowerCase()))
    .map((t, i) => {
      const idx = doc.extracted_text.toLowerCase().indexOf(t.toLowerCase());
      return {
        id: `hl-${i}`,
        text: doc.extracted_text.slice(idx, idx + t.length),
        label: query && query.toLowerCase().includes(t.toLowerCase()) ? "Query match" : "Skill",
      };
    })
    .filter((h, i, arr) => arr.findIndex((x) => x.text === h.text) === i)
    .slice(0, 8);
}

export function DocumentPreviewModal({
  doc: initialDoc,
  query = "",
  onClose,
  onDeleted,
  onUpdated,
}: {
  doc: DocRecord;
  query?: string;
  onClose: () => void;
  onDeleted?: (id: string) => void;
  onUpdated?: (doc: DocRecord) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<DocRecord>(initialDoc);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: initialDoc.title,
    issuer: initialDoc.issuer,
    doc_date: initialDoc.doc_date,
    category: initialDoc.category,
  });
  const { icon: Icon, tint } = categoryVisual(doc.category);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (nodes.length === 0) return;
      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [onClose]);


  useEffect(() => {
    let active = true;
    if (!doc.file_path) return;
    void signedUrl("documents", doc.file_path).then((u) => {
      if (active) setFileUrl(u);
    });
    return () => {
      active = false;
    };
  }, [doc.file_path]);

  const isImage = (doc.file_type ?? "").startsWith("image/");
  const isPdf = (doc.file_type ?? "").includes("pdf");

  const save = async () => {
    setBusy(true);
    try {
      await updateDocument(doc.id, form);
      const next = { ...doc, ...form };
      setDoc(next);
      onUpdated?.(next);
      setEditing(false);
      toast.success("Document updated");
    } catch {
      toast.error("Could not save your changes");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete “${doc.title}” from your vault?`)) return;
    setBusy(true);
    try {
      await deleteDocument(doc);
      toast.success("Removed from your vault");
      onDeleted?.(doc.id);
      onClose();
    } catch {
      toast.error("Could not delete this document");
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-black/60 p-3 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${doc.category} preview: ${doc.title}`}
        className="glass my-auto max-h-[92dvh] w-full max-w-[min(48rem,100%)] overflow-hidden rounded-3xl p-0"
      >
        <div
          className="flex items-center justify-between gap-3 p-5 text-white"
          style={{ background: `linear-gradient(135deg, ${tint}, var(--indigo))` }}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <Icon size={18} />
            </span>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-widest opacity-80">{doc.category}</div>
              <div className="truncate font-display text-xl sm:text-2xl">{doc.title}</div>
            </div>
          </div>
          <button
            ref={closeRef}
            aria-label="Close preview"
            onClick={onClose}
            className="rounded-lg bg-white/20 p-1.5 hover:bg-white/30"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[calc(92dvh-92px)] space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-5">
          <div className="flex flex-wrap gap-2 text-[11px]">
            {doc.issuer && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1">
                <Building2 size={11} /> {doc.issuer}
              </span>
            )}
            {doc.doc_date && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1">
                <Calendar size={11} /> {doc.doc_date}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-1 font-semibold text-emerald-700">
              <Sparkles size={11} /> Confidence {Math.round(doc.confidence * 100)}%
            </span>
          </div>

          {doc.file_path && (
            <div className="overflow-hidden rounded-2xl border border-black/5 bg-white/70">
              <div className="flex items-center justify-between gap-2 px-3 py-2 text-[11px] text-muted-foreground">
                <span className="truncate">{doc.file_name}</span>
                {fileUrl && (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    download={doc.file_name ?? undefined}
                    className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 font-semibold text-foreground"
                  >
                    <Download size={11} /> Open original
                  </a>
                )}
              </div>
              {fileUrl ? (
                isImage ? (
                  <img src={fileUrl} alt={doc.title} className="max-h-[42vh] w-full object-contain" />
                ) : isPdf ? (
                  <iframe src={fileUrl} title={doc.title} className="h-[42vh] w-full" />
                ) : (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    Preview not available for this file type — use “Open original”.
                  </div>
                )
              ) : (
                <div className="p-6 text-center text-xs text-muted-foreground">Loading proof…</div>
              )}
            </div>
          )}

          {doc.fields.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-3">
              {doc.fields.map((f) => (
                <div key={f.label} className="rounded-xl bg-white/60 p-2.5">
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                    {f.label}
                  </div>
                  <div className="mt-0.5 text-[12px] font-semibold">{f.value}</div>
                </div>
              ))}
            </div>
          )}

          {(doc.skills.length > 0 || doc.tags.length > 0) && (
            <div>
              <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Related skills & tags
              </div>
              <div className="flex flex-wrap gap-1.5">
                {doc.skills.map((s) => (
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
                {doc.tags.map((t) => (
                  <span key={t} className="rounded-full bg-white/70 px-2.5 py-1 text-[11px]">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {doc.extracted_text && (
            <div>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Extracted text · click a highlight to jump
              </div>
              <Suspense
                fallback={
                  <div className="rounded-2xl bg-white/60 p-4 text-xs text-muted-foreground">
                    Loading viewer…
                  </div>
                }
              >
                <DocumentViewer
                  fileName={doc.file_name ?? doc.title}
                  body={doc.extracted_text}
                  highlights={buildHighlights(doc, query)}
                />
              </Suspense>
            </div>
          )}

          {editing && (
            <div className="grid gap-2 rounded-2xl bg-white/70 p-3 sm:grid-cols-2">
              {([
                ["title", "Title"],
                ["issuer", "Issuer"],
                ["doc_date", "Date"],
              ] as const).map(([key, label]) => (
                <label key={key} className="min-w-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {label}
                  <input
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="mt-1 w-full rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-foreground outline-none ring-1 ring-black/5"
                  />
                </label>
              ))}
              <label className="min-w-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Category
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="mt-1 w-full rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-foreground outline-none ring-1 ring-black/5"
                >
                  {["Certificates", "Resumes", "Projects", "Internships", "Academics", "Events"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-2">
            {editing ? (
              <>
                <button
                  onClick={() => { setEditing(false); setForm({ title: doc.title, issuer: doc.issuer, doc_date: doc.doc_date, category: doc.category }); }}
                  className="rounded-xl bg-white/70 px-3 py-2 text-[11px] font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => void save()}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold text-white disabled:opacity-50"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  <Save size={12} /> Save changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-[11px] font-semibold hover:bg-white"
              >
                <Pencil size={12} /> Edit details
              </button>
            )}
            <button
              onClick={() => void remove()}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/10 px-3 py-2 text-[11px] font-semibold text-red-700 hover:bg-red-500/20 disabled:opacity-50"
            >
              <Trash2 size={12} /> Delete from vault
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
