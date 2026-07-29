import { motion } from "framer-motion";
import { Star } from "lucide-react";

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  initials: string;
  tint: string;
}

export function TestimonialsCard({ items }: { items: Testimonial[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((t, i) => (
        <motion.div
          key={t.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -6 }}
          className="glass group relative overflow-hidden rounded-2xl p-6"
        >
          <div className="flex gap-0.5 text-amber-400">
            {Array.from({ length: 5 }).map((_, k) => (
              <Star key={k} size={14} fill="currentColor" strokeWidth={0} />
            ))}
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-foreground">
            &ldquo;{t.quote}&rdquo;
          </p>
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
    </div>
  );
}
