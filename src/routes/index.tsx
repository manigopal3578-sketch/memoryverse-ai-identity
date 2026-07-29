import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Upload,
  Search,
  Clock,
  Share2,
  User,
  Network,
  ScanText,
  Layers,
  Zap,
  BrainCircuit,
  FolderTree,
  Wand2,
  MessageSquare,
  GitBranch,
  FileSearch,
  Rocket,
  Award,
  HeartHandshake,
  CircleDot,
  Menu,
  X,
  Home as HomeIcon,
} from "lucide-react";
import { toast } from "sonner";
import { FlipText } from "@/components/mv/FlipText";
import { CornerButton } from "@/components/mv/CornerButton";
import { RippleDisplacementSlider } from "@/components/mv/RippleDisplacementSlider";
import { Folder } from "@/components/mv/Folder";
import { AgentBentoGrid } from "@/components/mv/AgentBentoGrid";
import { GlassDock } from "@/components/mv/GlassDock";
import { TestimonialsCard } from "@/components/mv/TestimonialsCard";
import { BackgroundFX } from "@/components/mv/BackgroundFX";
import { KnowledgeGraph } from "@/components/mv/KnowledgeGraph";
import { UploadStudio } from "@/components/mv/UploadStudio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MemoryVerse AI — Your Digital Identity, Intelligently Composed" },
      {
        name: "description",
        content:
          "MemoryVerse AI turns scattered certificates, resumes and projects into one intelligent digital identity — for every student, every achievement, every story.",
      },
      { property: "og:title", content: "MemoryVerse AI" },
      {
        property: "og:description",
        content:
          "One intelligent memory vault for every student's academic and professional life.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
      <CircleDot size={10} className="text-primary" />
      {children}
    </div>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/upload", label: "Upload" },
    { to: "/search", label: "Search" },
    { to: "/timeline", label: "Timeline" },
    { to: "/graph", label: "Graph" },
    { to: "/profile", label: "Profile" },
  ] as const;
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="fixed inset-x-0 top-4 z-40 flex justify-center px-4"
    >
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
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-primary/5 hover:text-foreground"
              activeProps={{ className: "bg-primary/10 text-primary" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/upload" className="hidden md:block">
            <CornerButton className="!py-2 !px-4 text-xs">
              Get early access <ArrowRight size={14} />
            </CornerButton>
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="glass flex h-9 w-9 items-center justify-center rounded-xl md:hidden"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass absolute top-16 mx-4 w-[calc(100%-2rem)] max-w-5xl rounded-2xl p-3 md:hidden"
          >
            <div className="flex flex-col">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
              <Link to="/upload" onClick={() => setOpen(false)} className="mt-2 rounded-lg px-3 py-2 text-sm font-semibold text-white" style={{ background: "var(--gradient-hero)" }}>
                Get early access
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function Hero() {
  return (
    <section className="relative pt-40 pb-24 md:pt-48 md:pb-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
            >
              <SectionEyebrow>AI Digital Identity for Students</SectionEyebrow>
            </motion.div>
            <h1 className="font-display text-5xl leading-[1.02] tracking-tight text-foreground md:text-7xl">
              Every certificate.
              <br />
              Every project. One{" "}
              <FlipText words={["intelligent", "beautiful", "living", "memorable"]} />
              <br />
              digital <span className="text-gradient">memory.</span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground"
            >
              MemoryVerse AI reads every certificate, transcript, internship letter and
              project you&apos;ve ever made — then quietly composes it into one
              searchable, story-worthy digital identity you actually love owning.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <CornerButton>
                Build my MemoryVerse <ArrowRight size={16} />
              </CornerButton>
              <CornerButton variant="ghost">
                <Sparkles size={14} /> See the live demo
              </CornerButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.9 }}
              className="mt-10 flex flex-wrap items-center gap-5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground"
            >
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-emerald-500" />
                14,382 students onboard
              </span>
              <span>·</span>
              <span>1.2M documents understood</span>
              <span>·</span>
              <span>Built for hackathon 2026</span>
            </motion.div>
          </div>

          <div className="relative">
            <RippleDisplacementSlider />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-20 -left-6 hidden md:block"
            >
              <Folder />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSolution() {
  const items = [
    {
      icon: FolderTree,
      title: "The mess most students live in",
      desc: "Five folders on Drive. Three on WhatsApp. A pen-drive from 2022. Certificates you cannot find the night before an interview.",
      tint: "var(--rose)",
    },
    {
      icon: BrainCircuit,
      title: "One vault that actually understands",
      desc: "MemoryVerse reads each file, understands what it means, and links it to the story of who you are becoming.",
      tint: "var(--violet)",
    },
    {
      icon: HeartHandshake,
      title: "A future-you, always ready",
      desc: "Instant portfolio, instant resume, instant answers. Because your years of hard work deserve to be a beautiful proof, not a search bar.",
      tint: "var(--mint)",
    },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow>Problem · Solution</SectionEyebrow>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            Your achievements deserve <span className="text-gradient">a better home</span>.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.7 }}
              whileHover={{ y: -6 }}
              className="glass group relative overflow-hidden rounded-2xl p-7"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md"
                style={{ background: it.tint }}
              >
                <it.icon size={18} />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {it.desc}
              </p>
              <div
                className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-70"
                style={{ background: it.tint }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: Upload, title: "Smart Upload", desc: "Drop anything — the vault handles PDF, image, DOCX, and web links." },
    { icon: ScanText, title: "AI Categorization", desc: "Certificates, projects, internships, skills — sorted the moment they land." },
    { icon: FileSearch, title: "Semantic Search", desc: "Ask in plain English. The vault finds the memory, not just the file." },
    { icon: Clock, title: "Timeline View", desc: "Your journey, drawn as a beautiful, scrollable story of growth." },
    { icon: Network, title: "Relationship Graph", desc: "See how a skill led to a project, an internship, an award." },
    { icon: Wand2, title: "Profile Summary", desc: "A living bio that rewrites itself as you grow." },
    { icon: Zap, title: "Skill Extraction", desc: "Every document becomes a signal — auto-mapped to real skills." },
    { icon: Rocket, title: "Portfolio Builder", desc: "One click. A resume, a portfolio site, a story-worthy PDF." },
  ];
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow>Core capabilities</SectionEyebrow>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            Eight quiet superpowers, <span className="text-gradient">one calm vault</span>.
          </h2>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 4) * 0.08, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="glass group relative overflow-hidden rounded-2xl p-5"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
                style={{ background: "var(--gradient-hero)" }}
              >
                <f.icon size={16} />
              </div>
              <div className="mt-4 text-sm font-semibold">{f.title}</div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
              <div
                className="pointer-events-none absolute inset-x-6 bottom-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "var(--gradient-hero)" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Workspace() {
  const cells = [
    {
      icon: Upload,
      title: "Upload pipeline",
      desc: "Live queue of files being read, parsed and understood.",
      tone: "violet" as const,
      span: "md:col-span-2 md:row-span-1",
      children: (
        <div className="mt-2 space-y-2">
          {[
            ["capstone_report.pdf", "Extracting"],
            ["ml_cert_stanford.png", "Classifying"],
            ["intern_letter_.pdf", "Linking"],
          ].map(([n, s], i) => (
            <div key={n} className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2 text-[11px]">
              <span className="truncate">{n}</span>
              <span className="text-primary">{s}…</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: ScanText,
      title: "Extraction monitor",
      desc: "OCR + LLM pipeline confidence at 98.4%.",
      tone: "ice" as const,
      children: (
        <div className="mt-3 flex items-end gap-1.5 h-14">
          {[40, 65, 50, 80, 60, 90, 72, 84, 92, 78].map((h, i) => (
            <motion.span
              key={i}
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.7 }}
              className="w-2 rounded-full"
              style={{ background: "var(--gradient-hero)" }}
            />
          ))}
        </div>
      ),
    },
    {
      icon: MessageSquare,
      title: "Activity feed",
      desc: "12 new memories understood today.",
      tone: "mint" as const,
    },
    {
      icon: FileSearch,
      title: "Knowledge search",
      desc: "\u201cShow me proof of leadership in college.\u201d",
      tone: "rose" as const,
      span: "md:col-span-2",
      children: (
        <div className="mt-2 space-y-2 text-[11px]">
          {[
            "Head of GDG Campus · 2024 · verified",
            "Hackathon lead, 4 wins · linked to 3 skills",
            "Mentor for 12 juniors · testimonial found",
          ].map((r) => (
            <div key={r} className="rounded-lg bg-white/60 px-3 py-2">{r}</div>
          ))}
        </div>
      ),
    },
    {
      icon: GitBranch,
      title: "AI modules",
      desc: "OCR · NER · Embeddings · Graph · Summarizer.",
      tone: "amber" as const,
    },
    {
      icon: Award,
      title: "Identity score",
      desc: "A living, private measure of your growth.",
      tone: "violet" as const,
      children: (
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl text-gradient">86</span>
            <span className="text-[11px] text-muted-foreground">/ 100</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/5">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "86%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.4 }}
              className="h-full"
              style={{ background: "var(--gradient-hero)" }}
            />
          </div>
        </div>
      ),
    },
  ];
  return (
    <section id="workspace" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow>AI Workspace</SectionEyebrow>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            An intelligent control center for <span className="text-gradient">your own story</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Watch the AI think. Every document becomes a signal, every signal becomes a memory.
          </p>
        </div>
        <div className="mt-12">
          <AgentBentoGrid cells={cells} />
        </div>
      </div>
    </section>
  );
}

function UploadSection() {
  return (
    <section id="upload" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow>Upload experience</SectionEyebrow>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            Drop it. Forget it. <span className="text-gradient">Trust it.</span>
          </h2>
        </div>
        <div className="mt-12">
          <UploadStudio />
        </div>
      </div>
    </section>
  );
}

function Intelligence() {
  return (
    <section id="graph" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <SectionEyebrow>Intelligence · Graph</SectionEyebrow>
            <h2 className="font-display text-4xl leading-tight md:text-5xl">
              Certificate → skill → project → <span className="text-gradient">you</span>.
            </h2>
            <p className="mt-5 text-muted-foreground">
              MemoryVerse doesn&apos;t just store — it reasons. It sees the quiet lines
              connecting a hackathon award to a class project, a class project to your
              first internship, an internship to the person you&apos;re about to become.
            </p>
            <div className="mt-6 space-y-3">
              {[
                ["3 skills", "auto-linked to your ML certificate"],
                ["2 projects", "cited in your latest internship letter"],
                ["1 award", "explaining a strong recommendation"],
              ].map(([a, b]) => (
                <div key={a} className="glass flex items-center gap-3 rounded-xl px-4 py-3">
                  <Layers size={16} className="text-primary" />
                  <span className="text-sm">
                    <b className="text-foreground">{a}</b>{" "}
                    <span className="text-muted-foreground">{b}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <KnowledgeGraph />
        </div>
      </div>
    </section>
  );
}

function Love() {
  const testimonials = [
    {
      name: "Ananya R.",
      role: "CS, IIT Roorkee",
      quote:
        "It literally found me a certificate from 2nd year I had forgotten existed. My placement resume wrote itself in 6 seconds.",
      initials: "AR",
      tint: "var(--violet)",
    },
    {
      name: "Karan M.",
      role: "Design, NID",
      quote:
        "The timeline felt like reading a beautiful little novel about myself. I sent it to my mom and she cried.",
      initials: "KM",
      tint: "var(--amber)",
    },
    {
      name: "Zoya S.",
      role: "MBA, IIM-B",
      quote:
        "I stopped keeping folders. MemoryVerse is my second brain now. Judges, this thing is unfair.",
      initials: "ZS",
      tint: "var(--mint)",
    },
  ];
  return (
    <section id="love" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow>Loved by students</SectionEyebrow>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            The one tool <span className="text-gradient">they don&apos;t stop talking about</span>.
          </h2>
        </div>
        <div className="mt-12">
          <TestimonialsCard items={testimonials} />
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div
          className="glass relative overflow-hidden rounded-[2rem] p-10 text-center md:p-16"
          style={{ boxShadow: "var(--shadow-glow)" }}
        >
          <div
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl"
            style={{ background: "oklch(0.55 0.26 295 / 0.4)" }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl"
            style={{ background: "oklch(0.82 0.11 225 / 0.4)" }}
          />
          <SectionEyebrow>The last folder you&apos;ll ever make</SectionEyebrow>
          <h2 className="font-display text-4xl leading-tight md:text-6xl">
            Turn four scattered years <br />
            into <span className="text-gradient">one intelligent identity.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Free for students. Ready in under 60 seconds. Every certificate you have —
            welcomed home.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <CornerButton>
              Start my MemoryVerse <ArrowRight size={16} />
            </CornerButton>
            <CornerButton variant="ghost">Watch 30-sec demo</CornerButton>
          </div>
        </div>
        <p className="mt-10 text-center text-[11px] uppercase tracking-widest text-muted-foreground">
          MemoryVerse AI · Built with love for the 2026 hackathon
        </p>
      </div>
    </section>
  );
}

function Home() {
  const dockItems = [
    { icon: Upload, label: "Upload" },
    { icon: Search, label: "Search" },
    { icon: Clock, label: "Timeline" },
    { icon: Network, label: "Graph" },
    { icon: User, label: "Profile" },
    { icon: Share2, label: "Share" },
  ];
  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundFX />
      <Nav />
      <Hero />
      <ProblemSolution />
      <Features />
      <Workspace />
      <UploadSection />
      <Intelligence />
      <Love />
      <FinalCTA />
      <GlassDock items={dockItems} />
    </div>
  );
}
