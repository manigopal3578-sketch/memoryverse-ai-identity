import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { signedUrl } from "@/lib/library";

export function AvatarBubble({ size = 28 }: { size?: number }) {
  const { profile, user } = useAuth();
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const raw = profile?.avatar_url;
    if (!raw) {
      setUrl(null);
      return;
    }
    if (raw.startsWith("http")) {
      setUrl(raw);
      return;
    }
    void signedUrl("avatars", raw).then((u) => {
      if (active) setUrl(u);
    });
    return () => {
      active = false;
    };
  }, [profile?.avatar_url]);

  const initials = (profile?.full_name || user?.email || "?")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .map((s) => s[0]!.toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full text-[10px] font-semibold text-white"
      style={{ width: size, height: size, background: "var(--gradient-hero)" }}
    >
      {url ? <img src={url} alt="" className="h-full w-full object-cover" /> : initials}
    </span>
  );
}

export function AuthButton() {
  const { user, signInWithGoogle, signOut, loading } = useAuth();

  if (loading) {
    return <span className="h-7 w-20 animate-pulse rounded-xl bg-white/50" aria-hidden />;
  }

  if (!user) {
    return (
      <button
        onClick={() => void signInWithGoogle()}
        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-white transition hover:scale-[1.02]"
        style={{ background: "var(--gradient-hero)" }}
      >
        <LogIn size={12} /> Sign in
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Link
        to="/profile"
        aria-label="Open your profile"
        className="glass inline-flex items-center gap-1.5 rounded-xl px-2 py-1 text-xs font-semibold"
      >
        <AvatarBubble />
        <span className="hidden max-w-[110px] truncate sm:inline">
          {useAuthName()}
        </span>
      </Link>
      <button
        onClick={() => void signOut()}
        aria-label="Sign out"
        className="glass rounded-xl p-2 text-muted-foreground transition hover:text-foreground"
      >
        <LogOut size={13} />
      </button>
    </div>
  );
}

function useAuthName() {
  const { profile, user } = useAuth();
  return profile?.full_name || user?.email?.split("@")[0] || "Student";
}

export function SignedOutNotice({ what }: { what: string }) {
  const { signInWithGoogle } = useAuth();
  return (
    <div className="glass flex flex-col items-start gap-3 rounded-2xl p-6">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <UserIcon size={14} className="text-primary" /> Sign in to {what}
      </div>
      <p className="text-xs text-muted-foreground">
        Your documents, corrections, timeline and resume are private to your account and stay
        available every time you come back.
      </p>
      <button
        onClick={() => void signInWithGoogle()}
        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white"
        style={{ background: "var(--gradient-hero)" }}
      >
        <LogIn size={12} /> Continue with Google
      </button>
    </div>
  );
}
