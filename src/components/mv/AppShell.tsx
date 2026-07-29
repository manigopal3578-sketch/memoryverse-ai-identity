import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Upload, Search, Clock, Network, User, Share2, Home } from "lucide-react";
import { BackgroundFX } from "./BackgroundFX";
import { GlassDock } from "./GlassDock";
import { toast } from "sonner";
import type { ReactNode } from "react";

const nav = [
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/search", label: "Search", icon: Search },
  { to: "/timeline", label: "Timeline", icon: Clock },
  { to: "/graph", label: "Graph", icon: Network },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
}) {
  const dockItems = [
    { icon: Home, label: "Home", to: "/" },
    { icon: Upload, label: "Upload", to: "/upload" },
    { icon: Search, label: "Search", to: "/search" },
    { icon: Clock, label: "Timeline", to: "/timeline" },
    { icon: Network, label: "Graph", to: "/graph" },
    { icon: User, label: "Profile", to: "/profile" },
    {
      icon: Share2,
      label: "Share",
      to: "#",
      onClick: async () => {
        try {
          await navigator.clipboard?.writeText(window.location.href);
          toast.success("Link copied", { description: "Share your MemoryVerse anywhere." });
        } catch {
          toast("Share link", { description: window.location.href });
        }
      },
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden pb-32">
      <BackgroundFX />

      <header className="fixed inset-x-0 top-4 z-40 flex justify-center px-4">
        <div className="glass flex w-full max-w-5xl items-center justify-between rounded-2xl px-4 py-2.5">
          <Link to="/" className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
              style={{ background: "var(--gradient-hero)" }}
            >
              <Sparkles size={16} />
            </div>
            <span className="text-sm font-semibold tracking-tight">MemoryVerse</span>
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              AI
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeProps={{ className: "bg-primary/10 text-primary" }}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/"
            className="glass inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition hover:scale-[1.02]"
          >
            <ArrowLeft size={12} /> Home
          </Link>
        </div>
      </header>

      <section className="relative pt-32 pb-10">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {eyebrow}
            </div>
            <h1 className="font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">{title}</h1>
            {subtitle && (
              <p className="mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>
            )}
          </motion.div>
        </div>
      </section>

      <main className="relative">{children}</main>

      <GlassDock items={dockItems} />
    </div>
  );
}
