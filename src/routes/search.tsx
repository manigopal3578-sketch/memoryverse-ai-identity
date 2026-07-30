import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/mv/AppShell";
import { Search, Sparkles, ChevronLeft, ChevronRight, CornerDownLeft } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { vaultItems, type VaultCategory, type VaultItem } from "@/lib/vault-data";
import { ItemDetailModal } from "@/components/mv/ItemDetailModal";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Semantic Search — MemoryVerse AI" },
      { name: "description", content: "Ask in plain English. Find the memory, not just the file." },
      { property: "og:title", content: "Semantic Search — MemoryVerse AI" },
      { property: "og:description", content: "Natural language search across every document you own." },
    ],
  }),
  component: SearchPage,
});

type Category = "All" | VaultCategory;
type Sort = "relevance" | "recent" | "confidence";

const examples = [
  "Show my AI certificates",
  "Find internship letters",
  "Show my React projects",
  "Display my latest resume",
  "What events did I participate in?",
];

const PER_PAGE = 4;

function SearchPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category>("All");
  const [sort, setSort] = useState<Sort>("relevance");
  const [page, setPage] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [open, setOpen] = useState<VaultItem | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const query = q.toLowerCase().trim();
    const tokens = query.split(/\s+/).filter(Boolean);
    const filtered = vaultItems.filter((it) => {
      const inCat = cat === "All" || it.category === cat;
      if (!inCat) return false;
      if (tokens.length === 0) return true;
      const hay = `${it.title} ${it.meta} ${it.snippet} ${it.category} ${it.tags.join(" ")} ${it.skills.join(" ")}`.toLowerCase();
      return tokens.some((t) => hay.includes(t));
    });
    const scored = filtered.map((it) => {
      const hay = `${it.title} ${it.snippet} ${it.tags.join(" ")}`.toLowerCase();
      const relevance = tokens.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0) + it.confidence;
      return { it, relevance };
    });
    scored.sort((a, b) => {
      if (sort === "relevance") return b.relevance - a.relevance;
      if (sort === "recent") return b.it.date.localeCompare(a.it.date);
      return b.it.confidence - a.it.confidence;
    });
    return scored.map((s) => s.it);
  }, [q, cat, sort]);

  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const clampedPage = Math.min(page, pages - 1);
  const visible = results.slice(clampedPage * PER_PAGE, clampedPage * PER_PAGE + PER_PAGE);

  useEffect(() => setCursor(0), [q, cat, sort, page]);

  const onListKeyDown = (e: React.KeyboardEvent) => {
    if (open) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(visible.length - 1, Math.max(0, cursor + (e.key === "ArrowDown" ? 1 : -1)));
      setCursor(next);
      const el = listRef.current?.querySelectorAll<HTMLElement>("[data-result]")[next];
      el?.focus();
    }
    if (e.key === "ArrowRight" && clampedPage < pages - 1) setPage(clampedPage + 1);
    if (e.key === "ArrowLeft" && clampedPage > 0) setPage(clampedPage - 1);
  };

  const categories: Category[] = ["All", "Certificates", "Projects", "Internships", "Resumes", "Academics"];
  const sorts: { key: Sort; label: string }[] = [
    { key: "relevance", label: "Relevance" },
    { key: "recent", label: "Most recent" },
    { key: "confidence", label: "Confidence" },
  ];

  return (
    <AppShell
      eyebrow="Semantic Search"
      title={<>Ask anything. <span className="text-gradient">Find everything.</span></>}
      subtitle="Natural language across your entire memory vault — instant, private, human."
    >
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <div className="glass flex items-center gap-3 rounded-2xl p-3 shadow-[var(--shadow-glow)]">
          <Search size={18} className="ml-2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(0); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                listRef.current?.querySelectorAll<HTMLElement>("[data-result]")[0]?.focus();
              }
            }}
            placeholder="Try: show my AI certificates from 2024…"
            aria-label="Search your memory vault"
            className="flex-1 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={() => setPage(0)}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-white"
            style={{ background: "var(--gradient-hero)" }}
          >
            Search
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {examples.map((e) => (
            <button
              key={e}
              onClick={() => { setQ(e); setPage(0); }}
              className="glass rounded-full px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition hover:text-foreground"
            >
              {e}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => { setCat(c); setPage(0); }}
              className={cn(
                "rounded-full px-3 py-1.5 text-[11px] font-semibold transition",
                cat === c ? "text-white shadow-md" : "glass text-muted-foreground hover:text-foreground",
              )}
              style={cat === c ? { background: "var(--gradient-hero)" } : undefined}
            >
              {c}
            </button>
          ))}
          <span className="mx-1 text-muted-foreground/40">·</span>
          {sorts.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[11px] font-semibold transition",
                sort === s.key ? "bg-foreground text-background" : "glass text-muted-foreground hover:text-foreground",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span>
            {results.length} result{results.length === 1 ? "" : "s"} · page {clampedPage + 1} of {pages}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5">
            ↑ ↓ to move · <CornerDownLeft size={10} /> to open · ← → to page
          </span>
        </div>

        <div
          ref={listRef}
          onKeyDown={onListKeyDown}
          role="listbox"
          aria-label="Search results"
          className="mt-4 space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div
                    data-result
                    role="option"
                    aria-selected={cursor === i}
                    tabIndex={0}
                    onFocus={() => setCursor(i)}
                    onClick={() => setOpen(r)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOpen(r);
                      }
                    }}
                    className={cn(
                      "glass block w-full cursor-pointer rounded-2xl p-5 text-left transition hover:-translate-y-0.5",
                      cursor === i && "ring-2 ring-primary/50",
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                        style={{ background: r.tint }}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-sm font-semibold">{r.title}</div>
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                            {r.category}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            <Sparkles size={10} /> {Math.round(r.confidence * 100)}%
                          </span>
                        </div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">{r.meta}</div>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{r.snippet}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                          {r.tags.map((t) => (
                            <span key={t} className="rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-semibold text-foreground">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="hidden shrink-0 items-center gap-1 rounded-xl bg-white/60 px-3 py-1.5 text-[11px] font-semibold sm:inline-flex">
                        Open <CornerDownLeft size={12} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {results.length === 0 && (
            <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
              No memories match. Try a broader phrase.
            </div>
          )}
        </div>

        {pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={clampedPage === 0}
              className="glass flex h-9 w-9 items-center justify-center rounded-full disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-current={i === clampedPage ? "page" : undefined}
                className={cn(
                  "h-8 w-8 rounded-full text-[11px] font-semibold transition",
                  i === clampedPage ? "text-white" : "glass text-muted-foreground hover:text-foreground",
                )}
                style={i === clampedPage ? { background: "var(--gradient-hero)" } : undefined}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
              disabled={clampedPage === pages - 1}
              className="glass flex h-9 w-9 items-center justify-center rounded-full disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {open && <ItemDetailModal item={open} query={q} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </AppShell>
  );
}
