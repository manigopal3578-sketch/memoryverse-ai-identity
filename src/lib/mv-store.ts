import { useSyncExternalStore } from "react";

export type CorrectionKind = "edit" | "up" | "down";

export interface CorrectionEntry {
  id: string;
  itemId: string;
  itemName: string;
  field: string;
  kind: CorrectionKind;
  before: string;
  after: string;
  at: number;
}

let corrections: CorrectionEntry[] = [];
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export function logCorrection(entry: Omit<CorrectionEntry, "id" | "at">) {
  corrections = [
    { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: Date.now() },
    ...corrections,
  ].slice(0, 60);
  emit();
}

export function clearCorrections() {
  corrections = [];
  emit();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

const getSnapshot = () => corrections;
const getServerSnapshot = () => corrections;

export function useCorrections() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Naive word-level diff used by the correction history panel. */
export function wordDiff(before: string, after: string) {
  const a = before.split(/(\s+)/);
  const b = after.split(/(\s+)/);
  const removed = a.filter((w) => w.trim() && !b.includes(w));
  const added = b.filter((w) => w.trim() && !a.includes(w));
  return { removed, added };
}
