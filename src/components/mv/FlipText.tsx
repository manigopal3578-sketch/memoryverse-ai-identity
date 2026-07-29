import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function FlipText({
  words,
  className,
  interval = 2400,
}: {
  words: string[];
  className?: string;
  interval?: number;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);
  return (
    <span className={cn("relative inline-block align-baseline", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[i]}
          initial={{ y: "110%", opacity: 0, rotateX: -60 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          exit={{ y: "-110%", opacity: 0, rotateX: 60 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block text-gradient"
          style={{ transformOrigin: "50% 50% -20px" }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
      <span className="invisible" aria-hidden>
        {words.reduce((a, b) => (a.length > b.length ? a : b))}
      </span>
    </span>
  );
}
