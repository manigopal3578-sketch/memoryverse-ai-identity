import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth";
import { listDocuments, type DocRecord } from "@/lib/library";

interface LibraryValue {
  docs: DocRecord[];
  loading: boolean;
  refresh: () => Promise<void>;
  upsertLocal: (doc: DocRecord) => void;
  removeLocal: (id: string) => void;
}

const LibraryContext = createContext<LibraryValue | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [docs, setDocs] = useState<DocRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setDocs([]);
      return;
    }
    setLoading(true);
    try {
      setDocs(await listDocuments());
    } catch {
      setDocs([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const upsertLocal = useCallback((doc: DocRecord) => {
    setDocs((prev) => [doc, ...prev.filter((d) => d.id !== doc.id)]);
  }, []);

  const removeLocal = useCallback((id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const value = useMemo<LibraryValue>(
    () => ({ docs, loading, refresh, upsertLocal, removeLocal }),
    [docs, loading, refresh, upsertLocal, removeLocal],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary(): LibraryValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used inside LibraryProvider");
  return ctx;
}
