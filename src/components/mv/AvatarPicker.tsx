import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Check, Loader2, X, ZoomIn } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { uploadAvatar, updateProfile } from "@/lib/library";
import { AvatarBubble } from "./AuthButton";

/** Crops the picked image to a centred square at the chosen zoom/offset. */
async function cropToJpeg(src: string, zoom: number, offset: { x: number; y: number }) {
  const img = new Image();
  img.src = src;
  await img.decode();
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, size, size);
  const base = Math.min(img.width, img.height);
  const scale = (size / base) * zoom;
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, (size - w) / 2 + offset.x, (size - h) / 2 + offset.y, w, h);
  return new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.9),
  );
}

export function AvatarPicker() {
  const { user, profile, refreshProfile } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);

  const pick = useCallback((file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Pick an image from your gallery");
      return;
    }
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setSrc(URL.createObjectURL(file));
  }, []);

  const save = async () => {
    if (!src || !user) return;
    setSaving(true);
    try {
      const blob = await cropToJpeg(src, zoom, offset);
      const path = await uploadAvatar(user.id, blob);
      await updateProfile(user.id, { avatar_url: path });
      await refreshProfile();
      toast.success("Profile photo saved");
      setSrc(null);
    } catch {
      toast.error("Could not save that photo");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <AvatarBubble size={96} />
        <button
          onClick={() => inputRef.current?.click()}
          aria-label="Change profile photo"
          className="absolute -bottom-1 -right-1 rounded-full bg-white p-2 text-primary shadow-md transition hover:scale-105"
        >
          <Camera size={13} />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => pick(e.target.files?.[0])}
        />
      </div>
      {!profile?.avatar_url && (
        <span className="text-[10px] text-muted-foreground">Add a photo from your gallery</span>
      )}

      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSrc(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Crop profile photo"
            onClick={(e) => e.stopPropagation()}
            className="glass w-full max-w-sm rounded-3xl p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Crop your photo
              </div>
              <button onClick={() => setSrc(null)} aria-label="Cancel" className="rounded-lg p-1">
                <X size={15} />
              </button>
            </div>
            <div className="relative mx-auto h-56 w-56 overflow-hidden rounded-full bg-white">
              <img
                src={src}
                alt="Preview"
                draggable={false}
                className="absolute left-1/2 top-1/2 max-w-none select-none"
                style={{
                  transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <label className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
              <ZoomIn size={13} />
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
                aria-label="Zoom"
              />
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
              <label className="flex items-center gap-2 text-muted-foreground">
                X
                <input
                  type="range"
                  min={-80}
                  max={80}
                  value={offset.x}
                  onChange={(e) => setOffset((o) => ({ ...o, x: Number(e.target.value) }))}
                  className="w-full"
                  aria-label="Horizontal position"
                />
              </label>
              <label className="flex items-center gap-2 text-muted-foreground">
                Y
                <input
                  type="range"
                  min={-80}
                  max={80}
                  value={offset.y}
                  onChange={(e) => setOffset((o) => ({ ...o, y: Number(e.target.value) }))}
                  className="w-full"
                  aria-label="Vertical position"
                />
              </label>
            </div>
            <button
              onClick={() => void save()}
              disabled={saving}
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
              style={{ background: "var(--gradient-hero)" }}
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Save photo
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
