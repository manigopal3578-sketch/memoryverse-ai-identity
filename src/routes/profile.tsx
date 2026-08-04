import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/mv/AppShell";
import { CornerButton } from "@/components/mv/CornerButton";
import { CorrectionHistory } from "@/components/mv/CorrectionHistory";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Briefcase, Code2, Download, Edit3, FileText, GraduationCap, Share2, ExternalLink, X, Copy, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useAuth, profileCompleteness } from "@/lib/auth";
import { useLibrary } from "@/lib/useLibrary";
import { updateProfile } from "@/lib/library";
import { AvatarPicker } from "@/components/mv/AvatarPicker";
import { MyDocuments } from "@/components/mv/MyDocuments";
import { SignedOutNotice } from "@/components/mv/AuthButton";
import { QRCodeBox } from "@/components/mv/QRCodeBox";
import { buildShareImage } from "@/lib/og-card";
import {
  DEFAULT_SECTIONS,
  loadMyShare,
  publishShare,
  slugify,
  unpublishShare,
  type VisibleSections,
} from "@/lib/share";



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

const identity = {
  name: "Ananya Rao",
  tag: "CS Undergraduate · Building at the edge of AI and design",
  email: "ananya@memoryverse.ai",
  location: "Bengaluru, India",
  skills: ["React", "TypeScript", "Python", "ML", "System Design", "Product"],
  education: [
    { primary: "B.Tech, Computer Science", secondary: "IIT Roorkee · 2022 – 2026 · CGPA 9.1" },
    { primary: "AISSCE (12th)", secondary: "DPS · 2022 · 96.4%" },
  ],
  internships: [
    { primary: "Software Engineering Intern", secondary: "Google · Summer 2024 · Bangalore" },
    { primary: "Cloud Intern", secondary: "Microsoft · Winter 2023 · Hyderabad" },
  ],
  projects: [
    { primary: "MemoryVerse AI", secondary: "Capstone · React · LLM · 2024" },
    { primary: "Realtime Chat App", secondary: "React · WebSockets · 2023" },
  ],
  awards: [
    { primary: "Stanford ML Certificate", secondary: "Coursera · 2024" },
    { primary: "AWS Cloud Practitioner", secondary: "Amazon · 2023" },
    { primary: "1st place — HackCampus", secondary: "36-hour hack · 2022" },
  ],
  story:
    "Ananya is a builder — a rare mix of designer's eye and engineer's rigor. From her first hackathon win in 2022 to a Google summer internship in 2024, every artifact tells the same quiet story: someone who ships, learns, and elevates the people around her.",
};

interface ResumeData {
  email: string; location: string; story: string; skills: string[];
  education: { primary: string; secondary: string }[];
  internships: { primary: string; secondary: string }[];
  projects: { primary: string; secondary: string }[];
  awards: { primary: string; secondary: string }[];
}

async function generateResumePDF(name: string, tag: string, data: ResumeData) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(name, margin, y);
  y += 22;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(90);
  doc.text(tag, margin, y);
  y += 14;
  doc.text([data.email, data.location].filter(Boolean).join("  ·  "), margin, y);
  y += 24;

  const section = (title: string) => {
    doc.setTextColor(80, 40, 200);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title.toUpperCase(), margin, y);
    y += 6;
    doc.setDrawColor(220);
    doc.line(margin, y, 595 - margin, y);
    y += 14;
    doc.setTextColor(30);
  };

  const item = (primary: string, secondary: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(primary, margin, y);
    y += 13;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(110);
    doc.text(secondary, margin, y);
    y += 16;
    doc.setTextColor(30);
  };

  section("Summary");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  const wrapped = doc.splitTextToSize(data.story, 595 - margin * 2);
  doc.text(wrapped, margin, y);
  y += wrapped.length * 13 + 8;

  section("Skills");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.text(data.skills.join("  ·  ") || "—", margin, y);
  y += 22;

  section("Education");
  data.education.forEach((e) => item(e.primary, e.secondary));

  section("Experience");
  data.internships.forEach((e) => item(e.primary, e.secondary));

  section("Projects");
  data.projects.forEach((e) => item(e.primary, e.secondary));

  section("Awards & Certificates");
  data.awards.forEach((e) => item(e.primary, e.secondary));

  doc.setFontSize(8);
  doc.setTextColor(160);
  doc.text("Composed by MemoryVerse AI · memoryverse.ai", margin, 820);

  doc.save(`resume_${name.toLowerCase().replace(/\s+/g, "_")}.pdf`);
}

function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { docs } = useLibrary();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(identity.name);
  const [tag, setTag] = useState(identity.tag);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || profile.email.split("@")[0] || identity.name);
      setTag(profile.headline || identity.tag);
    }
  }, [profile?.id, profile?.full_name, profile?.headline]);

  const completeness = profileCompleteness(profile, docs.length);
  const isGuest = !user;

  // Demo/reference content is guest-only; signed-in students see their own data.
  const skills = isGuest ? identity.skills : (profile?.skills ?? []);
  const byCategory = (match: RegExp) =>
    docs
      .filter((d) => match.test(d.category))
      .map((d) => ({
        primary: d.title,
        secondary: [d.issuer, d.doc_date].filter(Boolean).join(" · ") || d.category,
      }));
  const education = isGuest ? identity.education : (profile?.education ?? []);
  const internships = isGuest ? identity.internships : byCategory(/intern|experience|work/i);
  const projects = isGuest ? identity.projects : byCategory(/project/i);
  const awards = isGuest ? identity.awards : byCategory(/certificate|award|achievement/i);
  const story = isGuest
    ? identity.story
    : profile?.bio ||
      `${name} is building a verified digital identity — ${docs.length} document${docs.length === 1 ? "" : "s"} stored and growing.`;

  const toggleEdit = async () => {
    if (editing && user) {
      setSaving(true);
      try {
        await updateProfile(user.id, { full_name: name, headline: tag });
        await refreshProfile();
        toast.success("Profile saved");
      } catch {
        toast.error("Could not save your profile");
      } finally {
        setSaving(false);
      }
    }
    setEditing((v) => !v);
  };
  const [shareOpen, setShareOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const [sections, setSections] = useState<VisibleSections>(DEFAULT_SECTIONS);
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [slug, setSlug] = useState(slugify(identity.name));

  useEffect(() => {
    setSlug(slugify(name || "student"));
  }, [name]);

  useEffect(() => {
    if (!user) {
      setPublished(false);
      setSections(DEFAULT_SECTIONS);
      return;
    }
    void loadMyShare(user.id).then((row) => {
      if (!row) return;
      setPublished(row.is_public);
      setSections({ ...DEFAULT_SECTIONS, ...(row.visible_sections ?? {}) });
      if (row.slug) setSlug(row.slug);
    });
  }, [user?.id]);

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/p/${slug}` : `/p/${slug}`;

  const togglePublish = async () => {
    if (!user) {
      toast("Sign in to publish", { description: "Your public card is tied to your account." });
      return;
    }
    setPublishing(true);
    try {
      if (published) {
        await unpublishShare(user.id);
        setPublished(false);
        toast.success("Public profile revoked", {
          description: "The /p link and QR code no longer open your card.",
        });
      } else {
        const og = await buildShareImage(user.id, {
          name: name,
          headline: tag,
          skills,
          docCount: docs.length,
          completeness,
          avatarUrl: profile?.avatar_url ?? null,
        });
        await publishShare(user.id, {
          slug,
          full_name: name,
          headline: tag,
          bio: story,
          location: profile?.location ?? "",
          avatar_path: profile?.avatar_url ?? null,
          og_image_url: og,
          skills,
          education,
          awards,
          timeline: [...internships, ...projects],
          projects,
          visible_sections: sections,
          doc_count: docs.length,
          completeness,
          is_public: true,
        });
        setPublished(true);
        toast.success("Public profile published", { description: shareUrl });
      }
    } catch {
      toast.error("Could not update your public profile");
    } finally {
      setPublishing(false);
    }
  };

  const savePublishedSections = async (next: VisibleSections) => {
    setSections(next);
    if (!user || !published) return;
    try {
      await publishShare(user.id, {
        slug,
        full_name: name,
        headline: tag,
        bio: story,
        location: profile?.location ?? "",
        avatar_path: profile?.avatar_url ?? null,
        skills,
        education,
        awards,
        timeline: [...internships, ...projects],
        projects,
        visible_sections: next,
        doc_count: docs.length,
        completeness,
        is_public: true,
      });
    } catch {
      toast.error("Could not save share settings");
    }
  };


  const copyShare = async () => {
    try {
      await navigator.clipboard?.writeText(shareUrl);
      setCopied(true);
      toast.success("Share link copied");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast("Share link", { description: shareUrl });
    }
  };

  const doExport = async () => {
    try {
      await generateResumePDF(name, tag, {
        email: profile?.email ?? identity.email,
        location: profile?.location ?? (isGuest ? identity.location : ""),
        story, skills, education, internships, projects, awards,
      });
      toast.success("Resume PDF generated", { description: "Downloaded to your device." });
    } catch (e) {
      toast.error("Could not generate PDF");
    }
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
            {user ? (
              <AvatarPicker />
            ) : (
              <div
                className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl font-display text-3xl text-white shadow-[var(--shadow-glow)]"
                style={{ background: "var(--gradient-hero)" }}
              >
                {name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
            )}
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
                {skills.map((s) => (
                  <span key={s} className="glass rounded-full px-2.5 py-1 font-semibold text-primary">{s}</span>
                ))}
                {!isGuest && skills.length === 0 && (
                  <span className="text-[11px] text-muted-foreground">No skills yet — upload documents to build them.</span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => void toggleEdit()}
                disabled={saving}
                className="glass inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold disabled:opacity-60"
              >
                <Edit3 size={12} /> {editing ? (saving ? "Saving…" : "Save") : "Edit"}
              </button>
              <button onClick={() => setShareOpen(true)} className="glass inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold">
                <Share2 size={12} /> Share
              </button>
              <button onClick={doExport} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white" style={{ background: "var(--gradient-hero)" }}>
                <Download size={12} /> Export Profile
              </button>
            </div>
          </div>
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-40 blur-3xl"
            style={{ background: "var(--gradient-hero)" }}
          />
        </div>

        {!user && (
          <div className="mt-6">
            <SignedOutNotice what="save your profile, photo and documents permanently" />
          </div>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="glass rounded-2xl p-6">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Profile completeness
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-5xl text-gradient">{user ? completeness : 0}</span>
              <span className="text-xs text-muted-foreground">%</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${user ? completeness : 0}%` }}
                transition={{ duration: 1 }}
                className="h-full"
                style={{ background: "var(--gradient-hero)" }}
              />
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              {user
                ? `${docs.length} document${docs.length === 1 ? "" : "s"} stored · photo, headline, skills and education all count.`
                : "Sign in with Google to start building your persistent identity."}
            </p>
          </div>
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
            <p className="mt-2 text-sm leading-relaxed">{story}</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Quick actions</div>
            <div className="mt-3 space-y-2">
              <button onClick={() => setResumeOpen(true)} className="flex w-full items-center justify-between rounded-xl bg-white/60 px-3 py-2 text-xs font-semibold hover:bg-white">
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
          {isGuest && (
            <div className="md:col-span-2 -mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Demo profile · sign in to see your own
            </div>
          )}
          {(isGuest || education.length > 0) && (
            <Section title="Education" icon={GraduationCap} tint="var(--violet)" items={education} />
          )}
          {(isGuest || internships.length > 0) && (
            <Section title="Internships" icon={Briefcase} tint="var(--ice)" items={internships} />
          )}
          {(isGuest || projects.length > 0) && (
            <Section title="Projects" icon={Code2} tint="var(--mint)" items={projects} />
          )}
          {(isGuest || awards.length > 0) && (
            <Section title="Awards & Certificates" icon={Award} tint="var(--amber)" items={awards} />
          )}
        </div>

        <div className="mt-8">
          <MyDocuments />
        </div>

        <div className="mt-8">
          <CorrectionHistory />
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

      {/* Share modal with link preview */}
      <AnimatePresence>
        {shareOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
            onClick={() => setShareOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass relative w-full max-w-md rounded-2xl p-6"
            >
              <button onClick={() => setShareOpen(false)} className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:text-foreground" aria-label="Close">
                <X size={16} />
              </button>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Share preview</div>
              <h3 className="mt-1 font-display text-2xl">Your shareable identity</h3>

              <div className="mt-5 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
                <div className="relative h-28" style={{ background: "var(--gradient-hero)" }}>
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt={`${name} profile photo`} className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/70" />
                    ) : (
                      <Sparkles size={24} />
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">memoryverse.ai</div>
                  <div className="mt-1 text-sm font-semibold">{name} · Digital Identity</div>
                  <div className="text-[11px] text-muted-foreground">{tag}</div>
                  {!isGuest && (
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                      {skills.slice(0, 4).map((s) => (
                        <span key={s} className="rounded-full bg-black/5 px-2 py-0.5 font-semibold text-primary">{s}</span>
                      ))}
                      <span className="rounded-full bg-black/5 px-2 py-0.5 font-semibold text-muted-foreground">
                        {docs.length} document{docs.length === 1 ? "" : "s"} · {completeness}% complete
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  What appears on your public card
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(DEFAULT_SECTIONS) as (keyof VisibleSections)[]).map((k) => (
                    <button
                      key={k}
                      onClick={() => void savePublishedSections({ ...sections, [k]: !sections[k] })}
                      aria-pressed={sections[k]}
                      className={
                        sections[k]
                          ? "rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize text-white"
                          : "glass rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize text-muted-foreground"
                      }
                      style={sections[k] ? { background: "var(--gradient-hero)" } : undefined}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-white/60 p-3">
                <QRCodeBox value={shareUrl} size={112} />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold">Scan to open on mobile</div>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    {published
                      ? "Your public, read-only identity card is live — no login needed to view it."
                      : "Publish to make this link open without login."}
                  </p>
                  <button
                    onClick={() => void togglePublish()}
                    disabled={publishing}
                    className={
                      published
                        ? "glass mt-2 rounded-xl px-3 py-1.5 text-[11px] font-semibold disabled:opacity-50"
                        : "mt-2 rounded-xl px-3 py-1.5 text-[11px] font-semibold text-white disabled:opacity-50"
                    }
                    style={published ? undefined : { background: "var(--gradient-hero)" }}
                  >
                    {publishing ? "Working…" : published ? "Unpublish" : "Publish public profile"}
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/60 p-2">
                <div className="flex-1 truncate px-2 text-[11px] text-muted-foreground">{shareUrl}</div>
                <button
                  onClick={copyShare}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-white"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy link</>}
                </button>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`My MemoryVerse identity`)}`} target="_blank" rel="noreferrer" className="glass rounded-xl px-3 py-2 text-center text-[11px] font-semibold">Twitter</a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="glass rounded-xl px-3 py-2 text-center text-[11px] font-semibold">LinkedIn</a>
                <a href={`mailto:?subject=My%20MemoryVerse&body=${encodeURIComponent(shareUrl)}`} className="glass rounded-xl px-3 py-2 text-center text-[11px] font-semibold">Email</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resume preview modal */}
      <AnimatePresence>
        {resumeOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
            onClick={() => setResumeOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="glass relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-8"
            >
              <button onClick={() => setResumeOpen(false)} className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:text-foreground" aria-label="Close">
                <X size={16} />
              </button>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-primary">Resume · AI-polished · v3</div>
              <h3 className="mt-1 font-display text-3xl">{name}</h3>
              <p className="text-xs text-muted-foreground">{tag}</p>
              <p className="mt-4 text-sm leading-relaxed">{story}</p>

              <ResumeBlock title="Skills">
                <p className="text-xs text-muted-foreground">{skills.join("  ·  ") || "—"}</p>
              </ResumeBlock>
              <ResumeBlock title="Education">
                {education.map((e) => <MiniRow key={e.primary} {...e} />)}
              </ResumeBlock>
              <ResumeBlock title="Experience">
                {internships.map((e) => <MiniRow key={e.primary} {...e} />)}
              </ResumeBlock>
              <ResumeBlock title="Projects">
                {projects.map((e) => <MiniRow key={e.primary} {...e} />)}
              </ResumeBlock>
              <ResumeBlock title="Awards">
                {awards.map((e) => <MiniRow key={e.primary} {...e} />)}
              </ResumeBlock>

              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setResumeOpen(false)} className="glass rounded-xl px-4 py-2 text-xs font-semibold">Close</button>
                <button onClick={doExport} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white" style={{ background: "var(--gradient-hero)" }}>
                  <Download size={12} /> Download PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}

function ResumeBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-primary">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function MiniRow({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <div className="rounded-lg bg-white/60 p-3">
      <div className="text-sm font-semibold">{primary}</div>
      <div className="text-[11px] text-muted-foreground">{secondary}</div>
    </div>
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
