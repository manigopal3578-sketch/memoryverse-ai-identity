import { supabase } from "@/integrations/supabase/client";

export interface DocField {
  label: string;
  value: string;
}

export interface DocRecord {
  id: string;
  user_id: string;
  title: string;
  category: string;
  issuer: string;
  doc_date: string;
  extracted_text: string;
  snippet: string;
  tags: string[];
  skills: string[];
  fields: DocField[];
  confidence: number;
  file_path: string | null;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  graph_node: string | null;
  timeline_event: string | null;
  is_demo: boolean;
  created_at: string;
}

function toDoc(row: Record<string, unknown>): DocRecord {
  return {
    id: String(row['id']),
    user_id: String(row['user_id']),
    title: String(row['title'] ?? ""),
    category: String(row['category'] ?? "Certificates"),
    issuer: String(row['issuer'] ?? ""),
    doc_date: String(row['doc_date'] ?? ""),
    extracted_text: String(row['extracted_text'] ?? ""),
    snippet: String(row['snippet'] ?? ""),
    tags: Array.isArray(row['tags']) ? (row['tags'] as string[]) : [],
    skills: Array.isArray(row['skills']) ? (row['skills'] as string[]) : [],
    fields: Array.isArray(row['fields']) ? (row['fields'] as DocField[]) : [],
    confidence: Number(row['confidence'] ?? 0.9),
    file_path: (row['file_path'] as string | null) ?? null,
    file_name: (row['file_name'] as string | null) ?? null,
    file_type: (row['file_type'] as string | null) ?? null,
    file_size: (row['file_size'] as number | null) ?? null,
    graph_node: (row['graph_node'] as string | null) ?? null,
    timeline_event: (row['timeline_event'] as string | null) ?? null,
    is_demo: Boolean(row['is_demo']),
    created_at: String(row['created_at'] ?? new Date().toISOString()),
  };
}

export async function listDocuments(): Promise<DocRecord[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => toDoc(r as Record<string, unknown>));
}

export interface NewDocument {
  title: string;
  category: string;
  issuer?: string;
  doc_date?: string;
  extracted_text?: string;
  snippet?: string;
  tags?: string[];
  skills?: string[];
  fields?: DocField[];
  confidence?: number;
  file_path?: string | null;
  file_name?: string | null;
  file_type?: string | null;
  file_size?: number | null;
}

export async function createDocument(userId: string, doc: NewDocument): Promise<DocRecord> {
  const { data, error } = await supabase
    .from("documents")
    .insert({ ...doc, user_id: userId } as never)
    .select("*")
    .single();
  if (error) throw error;
  return toDoc(data as Record<string, unknown>);
}

export async function updateDocument(id: string, patch: Partial<NewDocument>): Promise<void> {
  const { error } = await supabase.from("documents").update(patch as never).eq("id", id);
  if (error) throw error;
}

export async function deleteDocument(doc: DocRecord): Promise<void> {
  if (doc.file_path) await supabase.storage.from("documents").remove([doc.file_path]);
  const { error } = await supabase.from("documents").delete().eq("id", doc.id);
  if (error) throw error;
}

/** Upload a raw file into the caller's private folder and return its storage path. */
export async function uploadDocumentFile(userId: string, file: File): Promise<string> {
  const safe = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `${userId}/${Date.now()}_${safe}`;
  const { error } = await supabase.storage.from("documents").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function uploadAvatar(userId: string, blob: Blob): Promise<string> {
  const path = `${userId}/avatar_${Date.now()}.jpg`;
  const { error } = await supabase.storage.from("avatars").upload(path, blob, {
    contentType: "image/jpeg",
    upsert: true,
  });
  if (error) throw error;
  return path;
}

export async function signedUrl(
  bucket: "documents" | "avatars",
  path: string,
  expires = 3600,
): Promise<string | null> {
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, expires);
  return data?.signedUrl ?? null;
}

/* ------------------------------- corrections ------------------------------ */

export interface CorrectionRow {
  id: string;
  document_id: string | null;
  item_title: string;
  field_label: string;
  kind: "edit" | "up" | "down";
  before_text: string;
  after_text: string;
  created_at: string;
}

export async function listCorrections(): Promise<CorrectionRow[]> {
  const { data, error } = await supabase
    .from("corrections")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(80);
  if (error) throw error;
  return (data ?? []) as unknown as CorrectionRow[];
}

export async function saveCorrection(
  userId: string,
  entry: {
    document_id?: string | null;
    item_title: string;
    field_label: string;
    kind: "edit" | "up" | "down";
    before_text?: string;
    after_text?: string;
  },
): Promise<void> {
  const { error } = await supabase.from("corrections").insert({
    user_id: userId,
    document_id: entry.document_id ?? null,
    item_title: entry.item_title,
    field_label: entry.field_label,
    kind: entry.kind,
    before_text: entry.before_text ?? "",
    after_text: entry.after_text ?? "",
  });
  if (error) throw error;
}

export async function clearCorrectionsRemote(userId: string): Promise<void> {
  await supabase.from("corrections").delete().eq("user_id", userId);
}

/* --------------------------------- profile -------------------------------- */

export async function updateProfile(
  userId: string,
  patch: Record<string, unknown>,
): Promise<void> {
  const { error } = await supabase.from("profiles").update(patch as never).eq("id", userId);
  if (error) throw error;
}
