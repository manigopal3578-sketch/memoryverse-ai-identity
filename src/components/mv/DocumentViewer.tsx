import { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronUp, ChevronDown, X } from "lucide-react";

export interface Highlight {
  id: string;
  text: string;
  label: string;
  color?: string;
}

interface Props {
  fileName: string;
  body: string;
  highlights: Highlight[];
  onClose?: () => void;
}

export function DocumentViewer({ fileName, body, highlights, onClose }: Props) {
  const [active, setActive] = useState<string | null>(highlights[0]?.id ?? null);
  const refs = useRef<Record<string, HTMLElement | null>>({});

  const segments = useMemo(() => {
    if (highlights.length === 0) return [{ type: "text" as const, text: body }];
    // Build a regex matching any highlight text (escape)
    const escaped = highlights.map((h) => h.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const re = new RegExp(`(${escaped.join("|")})`, "g");
    const parts = body.split(re);
    return parts.map((p) => {
      const hit = highlights.find((h) => h.text === p);
      return hit ? { type: "hit" as const, text: p, hit } : { type: "text" as const, text: p };
    });
  }, [body, highlights]);

  useEffect(() => {
    if (active && refs.current[active]) {
      refs.current[active]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [active]);

  const jump = (dir: 1 | -1) => {
    if (!highlights.length) return;
    const idx = Math.max(0, highlights.findIndex((h) => h.id === active));
    const next = (idx + dir + highlights.length) % highlights.length;
    setActive(highlights[next].id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="glass rounded-2xl p-5"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Interactive document
          </div>
          <div className="truncate font-display text-lg">{fileName}</div>
        </div>
        <div className="flex items-center gap-1">
          <button
            aria-label="Previous highlight"
            onClick={() => jump(-1)}
            className="rounded-lg bg-white/70 p-1.5 hover:bg-white"
          >
            <ChevronUp size={14} />
          </button>
          <button
            aria-label="Next highlight"
            onClick={() => jump(1)}
            className="rounded-lg bg-white/70 p-1.5 hover:bg-white"
          >
            <ChevronDown size={14} />
          </button>
          {onClose && (
            <button
              aria-label="Close viewer"
              onClick={onClose}
              className="rounded-lg bg-white/70 p-1.5 hover:bg-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_180px]">
        <div className="max-h-[280px] overflow-y-auto rounded-xl bg-white/70 p-4 text-[13px] leading-relaxed">
          {segments.map((s, i) =>
            s.type === "hit" ? (
              <mark
                key={i}
                ref={(el) => {
                  refs.current[s.hit.id] = el;
                }}
                className={`mv-hit ${active === s.hit.id ? "active" : ""}`}
                tabIndex={0}
                role="button"
                aria-label={`Highlight: ${s.hit.label}`}
                onClick={() => setActive(s.hit.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(s.hit.id);
                  }
                }}
              >
                {s.text}
              </mark>
            ) : (
              <span key={i}>{s.text}</span>
            ),
          )}
        </div>
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            <Sparkles size={10} /> AI highlights
          </div>
          <div className="space-y-1.5">
            {highlights.map((h) => (
              <button
                key={h.id}
                onClick={() => setActive(h.id)}
                className={`w-full rounded-lg px-2.5 py-1.5 text-left text-[11px] transition ${
                  active === h.id ? "bg-primary/15 text-primary" : "bg-white/60 hover:bg-white"
                }`}
              >
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{h.label}</div>
                <div className="truncate font-semibold">{h.text}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
