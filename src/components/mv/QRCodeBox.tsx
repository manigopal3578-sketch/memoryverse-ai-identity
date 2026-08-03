import { useEffect, useState } from "react";

/** Renders a scannable QR code for any URL, generated lazily on the client. */
export function QRCodeBox({ value, size = 148 }: { value: string; size?: number }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void import("qrcode").then((mod) =>
      mod.default
        .toDataURL(value, { width: size * 2, margin: 1, color: { dark: "#1b1240", light: "#ffffff" } })
        .then((url: string) => {
          if (active) setSrc(url);
        })
        .catch(() => undefined),
    );
    return () => {
      active = false;
    };
  }, [value, size]);

  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-sm"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt="QR code for the shareable profile link" className="h-full w-full object-contain" />
      ) : (
        <span className="text-[10px] text-muted-foreground">Generating…</span>
      )}
    </div>
  );
}
