import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

export interface PublicProfileView {
  slug: string;
  full_name: string;
  headline: string;
  bio: string;
  location: string;
  avatar_url: string | null;
  skills: string[];
  education: { primary: string; secondary: string }[];
  awards: { primary: string; secondary: string }[];
  timeline: { primary: string; secondary: string }[];
  projects: { primary: string; secondary: string }[];
  visible_sections: Record<string, boolean>;
  doc_count: number;
  completeness: number;
}

export const getPublicProfile = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data.slug).slice(0, 120) }))
  .handler(async ({ data }): Promise<PublicProfileView | null> => {
    const client = createClient(
      process.env['SUPABASE_URL']!,
      process.env['SUPABASE_PUBLISHABLE_KEY']!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data: row } = await client
      .from("public_profiles")
      .select(
        "slug, full_name, headline, bio, location, avatar_url, skills, education, awards, timeline, projects, visible_sections, doc_count, completeness",
      )
      .eq("slug", data.slug)
      .eq("is_public", true)
      .maybeSingle();
    return (row as unknown as PublicProfileView) ?? null;
  });
