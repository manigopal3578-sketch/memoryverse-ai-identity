import { supabase } from "@/integrations/supabase/client";
import { signedUrl } from "@/lib/library";

export interface OgCardInput {
  name: string;
  headline: string;
  skills: string[];
  docCount: number;
  completeness: number;
  avatarUrl?: string | null;
}

const W = 1200;
const H = 630;

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = w;
      if (lines.length === maxLines) return lines;
    } else {
      line = next;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  return lines;
}

/** Draws a 1200x630 social preview card with the student's real photo, name and headline. */
export async function renderOgCard(input: OgCardInput): Promise<Blob | null> {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#2b1a6e");
  bg.addColorStop(0.55, "#5b32d6");
  bg.addColorStop(1, "#1b8fd1");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W - 140, 90, 20, W - 140, 90, 420);
  glow.addColorStop(0, "rgba(255,214,120,0.55)");
  glow.addColorStop(1, "rgba(255,214,120,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "600 26px Inter, system-ui, sans-serif";
  ctx.fillText("MEMORYVERSE AI · DIGITAL IDENTITY", 80, 96);

  const avatarSize = 168;
  const ax = 80;
  const ay = 156;
  ctx.save();
  roundRect(ctx, ax, ay, avatarSize, avatarSize, 40);
  ctx.clip();
  const img = input.avatarUrl ? await loadImage(input.avatarUrl) : null;
  if (img) {
    ctx.drawImage(img, ax, ay, avatarSize, avatarSize);
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(ax, ay, avatarSize, avatarSize);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 66px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const initials = (input.name || "S")
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    ctx.fillText(initials, ax + avatarSize / 2, ay + avatarSize / 2 + 4);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }
  ctx.restore();

  const tx = ax + avatarSize + 44;
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 68px Inter, system-ui, sans-serif";
  const nameLines = wrap(ctx, input.name || "Student", W - tx - 80, 2);
  let y = ay + 62;
  nameLines.forEach((l) => {
    ctx.fillText(l, tx, y);
    y += 74;
  });

  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.font = "400 30px Inter, system-ui, sans-serif";
  wrap(ctx, input.headline || "", W - tx - 80, 2).forEach((l) => {
    ctx.fillText(l, tx, y);
    y += 40;
  });

  let cx = 80;
  const cy = 452;
  ctx.font = "600 26px Inter, system-ui, sans-serif";
  input.skills.slice(0, 5).forEach((s) => {
    const w = ctx.measureText(s).width + 44;
    if (cx + w > W - 80) return;
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    roundRect(ctx, cx, cy, w, 52, 26);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText(s, cx + 22, cy + 35);
    cx += w + 14;
  });

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "600 28px Inter, system-ui, sans-serif";
  ctx.fillText(
    `${input.docCount} verified document${input.docCount === 1 ? "" : "s"} · ${input.completeness}% identity complete`,
    80,
    566,
  );

  return await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9),
  );
}

/** Renders + stores the share card and returns a long-lived absolute URL for og:image. */
export async function buildShareImage(userId: string, input: OgCardInput): Promise<string | null> {
  try {
    const blob = await renderOgCard(input);
    if (!blob) return null;
    const path = `${userId}/og_card.jpg`;
    const { error } = await supabase.storage.from("avatars").upload(path, blob, {
      contentType: "image/jpeg",
      upsert: true,
    });
    if (error) return null;
    return await signedUrl("avatars", path, 60 * 60 * 24 * 365);
  } catch {
    return null;
  }
}
