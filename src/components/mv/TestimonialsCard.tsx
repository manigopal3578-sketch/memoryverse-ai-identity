import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  initials: string;
  tint: string;
}

export function TestimonialsCard({ items }: { items: Testimonial[] }) {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  const visible = Array.from({ length: perPage }, (_, k) => items[(page * perPage + k) % items.length]);
  const go = (dir: number) => setPage((p) => (p + dir + pages) % pages);

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {visible.map((t, i) => (
            <motion.div
              key={t.name + i}
              whileHover={{ y: -6 }}
              className="glass group relative overflow-hidden rounded-2xl p-6"
            >
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-foreground">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ background: t.tint }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
              <div
                className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-60"
                style={{ background: t.tint }}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={() => go(-1)}
          aria-label="Previous testimonials"
          className="glass flex h-10 w-10 items-center justify-center rounded-full transition hover:scale-105"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-xs font-medium tracking-widest text-muted-foreground">
          {String(page + 1).padStart(2, "0")} / {String(pages).padStart(2, "0")}
        </span>
        <button
          onClick={() => go(1)}
          aria-label="Next testimonials"
          className="glass flex h-10 w-10 items-center justify-center rounded-full transition hover:scale-105"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
