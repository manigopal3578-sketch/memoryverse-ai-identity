import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { UploadCloud, CheckCircle2, FileText } from "lucide-react";

const stages = ["Uploading", "Extracting text", "Classifying", "Linking", "Ready"];

export function UploadStudio() {
  const [drag, setDrag] = useState(false);
  const [files, setFiles] = useState<{ name: string; stage: number }[]>([
    { name: "Google_Internship_Letter.pdf", stage: 4 },
    { name: "Hackathon_Winner_Cert.png", stage: 3 },
    { name: "Capstone_Report_v2.pdf", stage: 2 },
  ]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const list = Array.from(e.dataTransfer.files).slice(0, 3);
    setFiles((prev) => [
      ...list.map((f) => ({ name: f.name, stage: 0 })),
      ...prev,
    ].slice(0, 6));
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        animate={{ scale: drag ? 1.02 : 1 }}
        className="glass relative col-span-1 flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-2xl p-8 text-center md:col-span-2"
        style={{
          borderColor: drag ? "oklch(0.55 0.26 295)" : undefined,
          boxShadow: drag ? "var(--shadow-glow)" : undefined,
        }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-white"
          style={{ background: "var(--gradient-hero)" }}
        >
          <UploadCloud size={28} />
        </motion.div>
        <div>
          <div className="text-base font-semibold">Drop anything, anywhere</div>
          <p className="mt-1 text-xs text-muted-foreground">
            PDFs, images, transcripts, portfolio links — the AI understands them all.
          </p>
        </div>
        <div className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          PDF · PNG · JPG · DOCX · URL
        </div>
      </motion.div>

      <div className="col-span-1 space-y-3 md:col-span-3">
        {files.map((f, i) => {
          const pct = ((f.stage + 1) / stages.length) * 100;
          const done = f.stage === stages.length - 1;
          return (
            <motion.div
              key={f.name + i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white"
                  style={{ background: done ? "oklch(0.65 0.18 155)" : "var(--gradient-hero)" }}
                >
                  {done ? <CheckCircle2 size={16} /> : <FileText size={16} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{f.name}</div>
                  <div className="text-[11px] text-muted-foreground">{stages[f.stage]}…</div>
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {Math.round(pct)}%
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: "var(--gradient-hero)" }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
