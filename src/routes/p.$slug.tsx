import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPublicProfile, type PublicProfileView } from "@/lib/public-profile.functions";
import { BackgroundFX } from "@/components/mv/BackgroundFX";
import { Award, Briefcase, Code2, GraduationCap, MapPin, Sparkles } from "lucide-react";

const SITE = "https://memoryverse-ai-identity.lovable.app";

export const Route = createFileRoute("/p/$slug")({
  loader: async ({ params }) => {
    const profile = await getPublicProfile({ data: { slug: params.slug } });
    if (!profile) throw notFound();
    return profile;
  },
  head: ({ params, loaderData }) => {
    const name = loaderData?.full_name || "Student";
    const title = `${name} — Digital Identity | MemoryVerse AI`;
    const skills = (loaderData?.skills ?? []).slice(0, 5).join(" · ");
    const description =
      [loaderData?.headline, skills, loaderData?.completeness ? `${loaderData.completeness}% complete` : ""]
        .filter(Boolean)
        .join(" · ")
        .slice(0, 155) || "An AI-composed student identity on MemoryVerse AI.";
    const url = `${SITE}/p/${params.slug}`;
    const image = loaderData?.og_image_url ?? loaderData?.avatar_url ?? null;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "profile" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        ...(image && image.startsWith("https://")
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name,
            description: loaderData?.headline ?? "",
            address: loaderData?.location || undefined,
            knowsAbout: loaderData?.skills ?? [],
            url,
          }),
        },
      ],
    };
  },
  errorComponent: () => <Shell><Empty message="This profile could not be loaded." /></Shell>,
  notFoundComponent: () => <Shell><Empty message="This profile is private or does not exist." /></Shell>,
  component: PublicProfilePage,
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <BackgroundFX />
      <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">{children}</div>
    </main>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="glass rounded-3xl p-10 text-center">
      <h1 className="font-display text-2xl">Nothing to see here</h1>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      <Link to="/" className="mt-5 inline-block rounded-xl px-4 py-2 text-xs font-semibold text-white" style={{ background: "var(--gradient-hero)" }}>
        Visit MemoryVerse AI
      </Link>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  tint,
  items,
}: {
  title: string;
  icon: typeof Award;
  tint: string;
  items: { primary: string; secondary: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="glass min-w-0 rounded-2xl p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: tint }}>
          <Icon size={14} />
        </span>
        <h2 className="truncate text-sm font-semibold">{title}</h2>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((it) => (
          <div key={`${it.primary}-${it.secondary}`} className="min-w-0 rounded-xl bg-white/60 p-3">
            <div className="break-words text-sm font-semibold">{it.primary}</div>
            <div className="break-words text-[11px] text-muted-foreground">{it.secondary}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PublicProfilePage() {
  const p = Route.useLoaderData() as unknown as PublicProfileView;
  const v = p.visible_sections ?? {};
  const initials = (p.full_name || "S")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <Shell>
      <header className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 sm:gap-6">
          {p.avatar_url ? (
            <img
              src={p.avatar_url}
              alt={`${p.full_name} profile photo`}
              className="h-20 w-20 shrink-0 rounded-3xl object-cover sm:h-24 sm:w-24"
            />
          ) : (
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl font-display text-2xl text-white sm:h-24 sm:w-24"
              style={{ background: "var(--gradient-hero)" }}
            >
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="break-words font-display text-2xl sm:text-3xl">{p.full_name || "Student"}</h1>
            {p.headline && <p className="mt-1 break-words text-sm text-muted-foreground">{p.headline}</p>}
            {p.location && (
              <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin size={11} /> {p.location}
              </p>
            )}
          </div>
        </div>

        {p.bio && <p className="mt-5 break-words text-sm leading-relaxed">{p.bio}</p>}

        <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
          {v['skills'] !== false &&
            p.skills.map((s) => (
              <span key={s} className="glass rounded-full px-2.5 py-1 font-semibold text-primary">
                {s}
              </span>
            ))}
        </div>

        {v['completeness'] !== false && (
          <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 font-semibold text-primary">
              <Sparkles size={11} /> {p.completeness}% identity complete
            </span>
            <span className="rounded-full bg-white/70 px-2.5 py-1 font-semibold">
              {p.doc_count} verified document{p.doc_count === 1 ? "" : "s"}
            </span>
          </div>
        )}

        <div
          className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--gradient-hero)" }}
        />
      </header>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {v['education'] !== false && (
          <Section title="Education" icon={GraduationCap} tint="var(--violet)" items={p.education} />
        )}
        {v['projects'] !== false && (
          <Section title="Projects" icon={Code2} tint="var(--mint)" items={p.projects} />
        )}
        {v['awards'] !== false && (
          <Section title="Awards & Certificates" icon={Award} tint="var(--amber)" items={p.awards} />
        )}
        {v['timeline'] !== false && (
          <Section title="Journey" icon={Briefcase} tint="var(--ice)" items={p.timeline} />
        )}
      </div>

      <footer className="mt-10 text-center text-[11px] text-muted-foreground">
        Read-only identity card ·{" "}
        <Link to="/" className="font-semibold text-primary">
          Build yours on MemoryVerse AI
        </Link>
      </footer>
    </Shell>
  );
}
