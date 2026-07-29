import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  children: ReactNode;
}

export function CornerButton({ variant = "primary", className, children, ...rest }: Props) {
  const isPrimary = variant === "primary";
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "group relative inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium tracking-tight",
        "transition-all duration-300",
        isPrimary
          ? "text-white shadow-[var(--shadow-glow)]"
          : "text-foreground glass",
        className,
      )}
      style={
        isPrimary
          ? { background: "var(--gradient-hero)" }
          : undefined
      }
      {...(rest as any)}
    >
      {/* corner brackets */}
      <span className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-current opacity-70 transition-all duration-300 group-hover:h-4 group-hover:w-4" />
      <span className="pointer-events-none absolute -right-px -top-px h-3 w-3 border-r-2 border-t-2 border-current opacity-70 transition-all duration-300 group-hover:h-4 group-hover:w-4" />
      <span className="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 border-current opacity-70 transition-all duration-300 group-hover:h-4 group-hover:w-4" />
      <span className="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-current opacity-70 transition-all duration-300 group-hover:h-4 group-hover:w-4" />
      {isPrimary && (
        <span className="pointer-events-none absolute inset-0 -z-10 rounded-none opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
          style={{ background: "var(--gradient-hero)" }} />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
