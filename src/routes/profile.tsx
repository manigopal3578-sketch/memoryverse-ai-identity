import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/mv/AppShell";
import { CornerButton } from "@/components/mv/CornerButton";
import { motion } from "framer-motion";
import { Award, Briefcase, Code2, Download, Edit3, FileText, GraduationCap, Share2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Identity Profile — MemoryVerse AI" },
      { name: "description", content: "Your living, AI-composed digital identity." },
      { property: "og:title", content: "Identity Profile — MemoryVerse AI" },
      { property: "og:description", content: "One page. Every proof. All you." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Ananya Rao");
  const [tag, setTag] = useState("CS Undergraduate · Building at the edge of AI and design");

  const doShare = async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href);
      toast.success("Profile link copied", { description: "Ready to send to recruiters." });
    } catch {
      toast("Share link", { description: window.location.href });
    }
  };
  const doExport = () => {
    toast.success("Resume exported", { description: "resume_ananya_rao.pdf ready in your vault." });
  };
  const doViewResume = () => {
    toast("Opening resume preview", { description: "AI-polished · 1 page · v3" });
  };

  return (
    <AppShell
      eyebrow="Identity"
      title={<>Your living <span className="text-gradient">digital self</span>.</>}
      subtitle="Every skill, every proof, every story — composed by AI, owned by you."
    >
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="glass relative overflow-hidden rounded-3xl p-8">
          <div className="flex flex-wrap items-start gap-6">
            <div
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl font-display text-3xl text-white shadow-[var(--shadow-glow)]"
              style={{ background: "var(--gradient-hero)" }}
            >
              AR
            </div>
            <div className="min-w-0 flex-1">
              {editing ? (
                <div className="space-y-2">
                  <input value={name} onChange={(e) => setName(e.target.value)} className="glass w-full rounded-xl px-3 py-2 text-lg font-semibold outline-none" />
                  <input value={tag} onChange={(e) => setTag(e.target.value)} className="glass w-full rounded-xl px-3 py-2 text-sm outline-none" />
                </div>
              ) : (
                <>
                  <h2 className="font-display text-3xl">{name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{tag}</p>
                </>
              )}
              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                {["React", "Python", "ML", "System Design", "Product"].map((s) => (
                  <span key={s} className="glass rounded-full px-2.5 py-1 font-semibold text-primary">{s}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setEditing((v) => !v)} className="glass inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold">
                <Edit3 size={12} /> {editing ? "Save" : "Edit"}
              </button>
              <button onClick={doShare} className="glass inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold">
                <Share2 size={12} /> Share
              </button>
              <button onClick={doExport} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white" style={{ background: "var(--gradient-hero)" }}>
                <Download size={12} /> Export
              </button>
            </div>
          </div>
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-40 blur-3xl"
            style={{ background: "var(--gradient-hero)" }}
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="glass rounded-2xl p-6">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Identity score</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-5xl text-gradient">86</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/5">
              <motion.div initial={{ width: 0 }} animate={{ width: "86%" }} transition={{ duration: 1.3 }} className="h-full" style={{ background: "var(--gradient-hero)" }} />
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">Strong across projects, internships and certifications.</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">AI Career Story</div>
            <p className="mt-2 text-sm leading-relaxed">
              Ananya is a builder — a rare mix of designer's eye and engineer's rigor. From her first
              hackathon win in 2022 to a Google summer internship in 2024, every artifact tells the same
              quiet story: someone who ships, learns, and elevates the people around her.
            </p>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Quick actions</div>
            <div className="mt-3 space-y-2">
              <button onClick={doViewResume} className="flex w-full items-center justify-between rounded-xl bg-white/60 px-3 py-2 text-xs font-semibold hover:bg-white">
                View resume <ExternalLink size={12} />
              </button>
              <Link to="/upload" className="flex w-full items-center justify-between rounded-xl bg-white/60 px-3 py-2 text-xs font-semibold hover:bg-white">
                Add new memory <ExternalLink size={12} />
              </Link>
              <Link to="/graph" className="flex w-full items-center justify-between rounded-xl bg-white/60 px-3 py-2 text-xs font-semibold hover:bg-white">
                Explore graph <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Section title="Education" icon={GraduationCap} tint="var(--violet)" items={[
            { primary: "B.Tech, Computer Science", secondary: "IIT Roorkee · 2022 – 2026 · CGPA 9.1" },
            { primary: "AISSCE (12th)", secondary: "DPS · 2022 · 96.4%" },
          ]} />
          <Section title="Internships" icon={Briefcase} tint="var(--ice)" items={[
            { primary: "Software Engineering Intern", secondary: "Google · Summer 2024 · Bangalore" },
            { primary: "Cloud Intern", secondary: "Microsoft · Winter 2023 · Hyderabad" },
          ]} />
          <Section title="Projects" icon={Code2} tint="var(--mint)" items={[
            { primary: "MemoryVerse AI", secondary: "Capstone · React · LLM · 2024" },
            { primary: "Realtime Chat App", secondary: "React · WebSockets · 2023" },
          ]} />
          <Section title="Awards & Certificates" icon={Award} tint="var(--amber)" items={[
            { primary: "Stanford ML Certificate", secondary: "Coursera · 2024" },
            { primary: "AWS Cloud Practitioner", secondary: "Amazon · 2023" },
            { primary: "1st place — HackCampus", secondary: "36-hour hack · 2022" },
          ]} />
        </div>

        <div className="mt-8 glass rounded-2xl p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Recent documents</div>
            <Link to="/search" className="text-[11px] font-semibold text-primary">See all →</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Google_Internship_Letter.pdf",
              "Stanford_ML_Cert.pdf",
              "Capstone_Report_v2.pdf",
              "Hackathon_Winner_Cert.png",
              "Resume_v3.pdf",
              "Transcript_Sem6.pdf",
            ].map((d) => (
              <div key={d} className="flex items-center gap-3 rounded-xl bg-white/60 p-3 text-xs">
                <FileText size={14} className="text-primary" />
                <span className="truncate">{d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <CornerButton onClick={doExport}>
            <Download size={14} /> Export identity PDF
          </CornerButton>
          <Link to="/">
            <CornerButton variant="ghost">Back to home</CornerButton>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function Section({
  title, icon: Icon, tint, items,
}: {
  title: string;
  icon: typeof Award;
  tint: string;
  items: { primary: string; secondary: string }[];
}) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl text-white" style={{ background: tint }}>
          <Icon size={14} />
        </span>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((it) => (
          <div key={it.primary} className="rounded-xl bg-white/60 p-3">
            <div className="text-sm font-semibold">{it.primary}</div>
            <div className="text-[11px] text-muted-foreground">{it.secondary}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
