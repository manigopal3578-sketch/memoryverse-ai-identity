import { motion } from "framer-motion";

/**
 * Lightweight WebGL-free ripple/displacement showcase.
 * Two blended layers with animated masks to evoke a fluid "ripple" reveal.
 */
export function RippleDisplacementSlider({
  image,
  alt,
  aspect = "aspect-[4/3]",
}: {
  image?: string;
  alt?: string;
  aspect?: string;
} = {}) {
  return (
    <div className={`relative ${aspect} w-full overflow-hidden rounded-3xl glow-ring`}>
      {/* Base gradient scene */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      {image && (
        <img
          src={image}
          alt={alt ?? "MemoryVerse AI showcase"}
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {/* Mesh blobs */}
      <motion.div
        className="absolute -left-20 top-10 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "oklch(0.85 0.13 165 / 0.6)" }}
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-16 bottom-0 h-80 w-80 rounded-full blur-3xl"
        style={{ background: "oklch(0.82 0.15 75 / 0.55)" }}
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/3 top-1/3 h-60 w-60 rounded-full blur-3xl"
        style={{ background: "oklch(0.82 0.11 15 / 0.5)" }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Ripple rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full border border-white/40"
          style={{ width: 60, height: 60, x: "-50%", y: "-50%" }}
          animate={{ scale: [1, 6], opacity: [0.7, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: "easeOut" }}
        />
      ))}

      {/* Grain */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      {/* Foreground caption chip */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
        <div className="glass-dark rounded-xl px-4 py-3 text-white">
          <div className="text-[10px] font-medium uppercase tracking-widest opacity-70">
            Featured story
          </div>
          <div className="mt-1 text-sm font-semibold">
            &ldquo;My scattered 4 years, one intelligent identity.&rdquo;
          </div>
        </div>
        <div className="glass-dark hidden rounded-full px-3 py-1.5 text-[11px] font-medium text-white sm:block">
          Live · demo
        </div>
      </div>
    </div>
  );
}
