import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

export interface EducationEntry {
  primary: string;
  secondary: string;
}

export interface StudentProfile {
  id: string;
  full_name: string;
  headline: string;
  bio: string;
  email: string;
  location: string;
  avatar_url: string | null;
  education: EducationEntry[];
  skills: string[];
  social_links: Record<string, string>;
  settings: Record<string, unknown>;
}

interface AuthValue {
  user: User | null;
  session: Session | null;
  profile: StudentProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setProfileLocal: (p: StudentProfile) => void;
}

const AuthContext = createContext<AuthValue | null>(null);

function normalize(row: Record<string, unknown>): StudentProfile {
  return {
    id: String(row['id'] ?? ""),
    full_name: String(row['full_name'] ?? ""),
    headline: String(row['headline'] ?? ""),
    bio: String(row['bio'] ?? ""),
    email: String(row['email'] ?? ""),
    location: String(row['location'] ?? ""),
    avatar_url: (row['avatar_url'] as string | null) ?? null,
    education: Array.isArray(row['education']) ? (row['education'] as EducationEntry[]) : [],
    skills: Array.isArray(row['skills']) ? (row['skills'] as string[]) : [],
    social_links: (row['social_links'] as Record<string, string>) ?? {},
    settings: (row['settings'] as Record<string, unknown>) ?? {},
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (user: User) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (data) {
      setProfile(normalize(data as Record<string, unknown>));
      return;
    }
    // Fallback: create the profile if the signup trigger has not landed yet.
    const meta = user.user_metadata ?? {};
    const { data: created } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        full_name: String(meta['full_name'] ?? meta['name'] ?? ""),
        email: user.email ?? "",
        avatar_url: (meta['avatar_url'] as string) ?? null,
      })
      .select("*")
      .maybeSingle();
    if (created) setProfile(normalize(created as Record<string, unknown>));
  }, []);

  useEffect(() => {
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!active) return;
      setSession(s);
      if (!s?.user) setProfile(null);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session?.user) void loadProfile(session.user);
  }, [session?.user?.id, loadProfile]);

  const signInWithGoogle = useCallback(async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed", { description: result.error.message });
      return;
    }
    if (result.redirected) return;
    toast.success("Signed in");
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
    toast("Signed out", { description: "Your vault stays safe until you return." });
  }, []);

  const refreshProfile = useCallback(async () => {
    if (session?.user) await loadProfile(session.user);
  }, [session?.user, loadProfile]);

  const value = useMemo<AuthValue>(
    () => ({
      user: session?.user ?? null,
      session,
      profile,
      loading,
      signInWithGoogle,
      signOut,
      refreshProfile,
      setProfileLocal: setProfile,
    }),
    [session, profile, loading, signInWithGoogle, signOut, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function profileCompleteness(p: StudentProfile | null, docCount: number) {
  if (!p) return 0;
  const checks = [
    !!p.full_name,
    !!p.headline,
    !!p.bio,
    !!p.location,
    !!p.avatar_url,
    p.skills.length > 0,
    p.education.length > 0,
    Object.values(p.social_links).some(Boolean),
    docCount > 0,
    docCount >= 5,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
