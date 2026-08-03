import { Award, Briefcase, Code2, FileText, GraduationCap, Sparkles } from "lucide-react";
import type { DocRecord } from "@/lib/library";
import type { VaultCategory, VaultItem } from "@/lib/vault-data";

const meta: Record<string, { icon: typeof Award; tint: string }> = {
  Certificates: { icon: Award, tint: "var(--amber)" },
  Projects: { icon: Code2, tint: "var(--mint)" },
  Internships: { icon: Briefcase, tint: "var(--ice)" },
  Resumes: { icon: FileText, tint: "var(--violet)" },
  Academics: { icon: GraduationCap, tint: "var(--rose)" },
  Events: { icon: Sparkles, tint: "var(--indigo)" },
};

/** Map a persisted user document into the shared vault-item shape used by search/graph/timeline. */
export function docToVaultItem(d: DocRecord): VaultItem {
  const visual = meta[d.category] ?? { icon: FileText, tint: "var(--violet)" };
  const date = d.doc_date || d.created_at.slice(0, 10);
  return {
    id: d.id,
    title: d.title,
    meta: [d.issuer, date].filter(Boolean).join(" · ") || d.category,
    category: (d.category as VaultCategory) ?? "Certificates",
    icon: visual.icon,
    tint: visual.tint,
    snippet: d.snippet || d.extracted_text.slice(0, 180),
    tags: d.tags,
    skills: d.skills,
    confidence: d.confidence,
    date,
    issuer: d.issuer,
    body: d.extracted_text,
    fields: d.fields,
  };
}

export const CATEGORY_VISUAL = meta;
