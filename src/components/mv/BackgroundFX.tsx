import { motion } from "framer-motion";

export function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* soft mesh */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 10%, oklch(0.55 0.26 295 / 0.18), transparent 60%), radial-gradient(50% 45% at 85% 20%, oklch(0.82 0.11 225 / 0.35), transparent 60%), radial-gradient(50% 45% at 75% 90%, oklch(0.85 0.13 165 / 0.25), transparent 60%), radial-gradient(45% 40% at 10% 85%, oklch(0.82 0.15 75 / 0.2), transparent 60%)",
        }}
      />
      {/* floating orbs */}
      <motion.div
        className="absolute left-[10%] top-[30%] h-40 w-40 rounded-full blur-3xl"
        style={{ background: "oklch(0.55 0.26 295 / 0.35)" }}
        animate={{ y: [0, -40, 0], x: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[8%] top-[55%] h-56 w-56 rounded-full blur-3xl"
        style={{ background: "oklch(0.82 0.11 225 / 0.35)" }}
        animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* particles */}
      {Array.from({ length: 22 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            boxShadow: "0 0 8px 2px oklch(0.55 0.26 295 / 0.6)",
          }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.9, 0.2] }}
          transition={{
            duration: 4 + (i % 5),
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.2 0.05 275) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.2 0.05 275) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />
    </div>
  );
}
