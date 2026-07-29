import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/mv/AppShell";
import { UploadStudio } from "@/components/mv/UploadStudio";
import { CornerButton } from "@/components/mv/CornerButton";
import { ArrowRight, Search } from "lucide-react";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload Studio — MemoryVerse AI" },
      { name: "description", content: "Drop certificates, resumes, projects — the AI understands, categorizes, and stores every document." },
      { property: "og:title", content: "Upload Studio — MemoryVerse AI" },
      { property: "og:description", content: "Every document, understood the moment it lands." },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  return (
    <AppShell
      eyebrow="Upload Studio"
      title={<>Drop it. Forget it. <span className="text-gradient">Trust it.</span></>}
      subtitle="PDFs, images, transcripts, portfolio links — everything becomes searchable memory."
    >
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <UploadStudio />

        <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/search">
            <CornerButton>
              Search my vault <Search size={14} />
            </CornerButton>
          </Link>
          <Link to="/timeline">
            <CornerButton variant="ghost">
              View timeline <ArrowRight size={14} />
            </CornerButton>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
