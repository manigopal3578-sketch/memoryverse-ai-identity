import { supabase } from "@/integrations/supabase/client";
import { signedUrl } from "@/lib/library";

export interface VisibleSections {
  skills: boolean;
  education: boolean;
  awards: boolean;
  timeline: boolean;
  projects: boolean;
  completeness: boolean;
}

export const DEFAULT_SECTIONS: VisibleSections = {
  skills: true,
  education: true,
  awards: true,
  timeline: true,
  projects: true,
  completeness: true,
};

export interface PublicProfile {
  user_id: string;
  slug: string;
  is_public: boolean;
  full_name: string;
  headline: string;
  bio: string;
  location: string;
  avatar_url: string | null;
  og_image_url: string | null;
  skills: string[];
  education: { primary: string; secondary: string }[];
  awards: { primary: string; secondary: string }[];
  timeline: { primary: string; secondary: string }[];
  projects: { primary: string; secondary: string }[];
  visible_sections: VisibleSections;
  doc_count: number;
  completeness: number;
}


export function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "student"
  );
}

export async function loadMyShare(userId: string): Promise<PublicProfile | null> {
  const { data } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return (data as unknown as PublicProfile) ?? null;
}

export interface PublishInput {
  slug: string;
  full_name: string;
  headline: string;
  bio: string;
  location: string;
  avatar_path: string | null;
  skills: string[];
  education: { primary: string; secondary: string }[];
  awards: { primary: string; secondary: string }[];
  timeline: { primary: string; secondary: string }[];
  projects: { primary: string; secondary: string }[];
  visible_sections: VisibleSections;
  doc_count: number;
  completeness: number;
  is_public: boolean;
}

/** Publish (or update) the read-only identity card that anonymous visitors can open. */
export async function publishShare(userId: string, input: PublishInput): Promise<PublicProfile> {
  let avatar: string | null = null;
  if (input.avatar_path) {
    avatar = input.avatar_path.startsWith("http")
      ? input.avatar_path
      : await signedUrl("avatars", input.avatar_path, 60 * 60 * 24 * 365);
  }
  const { avatar_path: _drop, ...rest } = input;
  const { data, error } = await supabase
    .from("public_profiles")
    .upsert({ ...rest, avatar_url: avatar, user_id: userId } as never, { onConflict: "user_id" })
    .select("*")
    .single();
  if (error) throw error;
  return data as unknown as PublicProfile;
}

export async function unpublishShare(userId: string): Promise<void> {
  const { error } = await supabase
    .from("public_profiles")
    .update({ is_public: false } as never)
    .eq("user_id", userId);
  if (error) throw error;
}
