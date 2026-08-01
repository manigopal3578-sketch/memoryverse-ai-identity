# MemoryVerse AI — Student Digital Identity System

> From scattered files to a smart digital identity.
> Upload → Extract → Classify → Embed & Connect → Search → Profile.

MemoryVerse AI turns a student's scattered certificates, resumes, project reports and
internship letters into one searchable, explainable, privacy-preserving digital identity.

**Live demo:** https://memoryverse-ai-identity.lovable.app

---

## Judge Demo Script (3 minutes)

1. **Upload** — open `/upload`, drag-drop a certificate PDF/PNG (or paste a portfolio URL).
2. **Watch the pipeline** — Receive → OCR/Extract → Classify → Embed & Connect → Index.
   Note the smart auto-name, extracted fields, confidence score and OCR-fallback badge.
   Then open the new item in `/timeline`.
3. **Search** — go to `/search`, ask *"Show my React projects"*. Open a snippet card;
   the detail modal shows the grounded source text with clickable AI highlights.
4. **Graph + export** — open `/graph`, click a node to see its story panel and related
   documents, then go to `/profile` and click **Export Profile** to download the PDF resume.

A "Judge Notes" card summarising architecture, honesty about mocks, and a 60-second
validation path is rendered directly on the landing page (`#judges`).

---

## Architecture

```text
                ┌──────────────────────────────────────────────┐
  Browser  ──►  │  TanStack Start (React 19, Vite 7, Tailwind)  │
                │  routes: / /upload /search /timeline /graph   │
                │          /profile                            │
                └───────────────┬──────────────────────────────┘
                                │
                 ┌──────────────▼───────────────┐
                 │  Processing pipeline (local) │
                 │  1 receive   (file/URL)      │
                 │  2 ocr/extract (+fallback)   │
                 │  3 classify  (category/NER)  │
                 │  4 embed & connect (vectors) │
                 │  5 index     (vault + graph) │
                 └──────────────┬───────────────┘
                                │
      ┌───────────────┬─────────┴─────────┬──────────────────┐
      ▼               ▼                   ▼                  ▼
 Vault registry   Vector index      Knowledge graph      Corrections log
 src/lib/         (file-backed      (nodes + edges)      (audit of edits
 vault-data.ts     mock)                                  and 👍/👎)
      │
      └──► exports/*.json  ← real, inspectable processed outputs per demo doc
```

Key modules:

| Path | Role |
| --- | --- |
| `src/components/mv/UploadStudio.tsx` | Drag-drop + URL import, live 5-stage pipeline, per-field 👍/👎 and inline edit |
| `src/lib/smart-name.ts` | File-type detection and smart auto-naming ("Certificate — Cipher AI") |
| `src/lib/vault-data.ts` | Vault registry of 10 preloaded demo documents with fields, tags, skills, confidence |
| `src/lib/mv-store.ts` | Corrections history store (before/after word diffs + timestamps) |
| `src/components/mv/DocumentViewer.tsx` | Lazy-loaded viewer with keyboard-navigable highlight spans |
| `src/components/mv/KnowledgeGraph.tsx` | Interactive graph: zoom, pan, reset, filters, node detail panel |
| `src/routes/search.tsx` | Semantic search: filters, sorting, pagination, keyboard navigation |
| `src/routes/profile.tsx` | Identity score, PDF resume export (jsPDF, lazy-loaded), share link preview |
| `exports/` | Processed JSON artifact for every demo document + `index.json` manifest |

---

## Honest scope: what is real vs. simulated

This build ships **no proprietary LLM keys** and requires none.

| Capability | Status |
| --- | --- |
| Upload, type detection, smart naming | Real, in-browser |
| 5-stage pipeline UI + per-stage progress | Real UI over a deterministic local processor |
| OCR text extraction / OCR-fallback badge | **Simulated deterministically** (no Tesseract binary in the browser runtime) |
| Entity extraction (issuer, date, skills) | **Simulated deterministically** from document fixtures |
| Embeddings + vector similarity | **File-backed mock** (deterministic scoring), not ChromaDB/pgvector |
| RAG answers | Grounded to stored documents; snippets always cite their source document |
| Timeline / graph / search / profile updates | Real — driven by the same store the uploads write to |
| PDF resume export, share link | Real (jsPDF, clipboard) |

Every simulated stage writes a **real artifact** — see `exports/` — so judges can inspect
the exact processed output for each demo document rather than trusting the UI.

To swap in a real backend, replace the pipeline calls in `UploadStudio.tsx` with
`POST /upload`, `GET /search`, `GET /graph` endpoints (FastAPI + PyPDF + Tesseract +
ChromaDB) — the front end already consumes exactly that shape (see `exports/index.json`).

---

## Run locally

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev          # http://localhost:8080
npm run build        # production build
```

Copy `.env.example` to `.env` if you wire in a real backend. No keys are needed for the demo.

---

## Demo data

10 preloaded demo documents ship with the app (certificates, projects, internship
letters, resume, transcript, event proof, portfolio link). Their processed outputs live in
`exports/` — one JSON per document plus `exports/index.json`.

## Demo video / GIF

A 30–60s screen capture of *upload → pipeline → timeline → graph → resume export* should be
placed at `docs/demo.gif` and linked here. **Not included in this repo** — record it from the
live demo using the Judge Demo Script above.

---

## Final verification checklist

- [x] Upload pipeline works and shows 5 stages.
- [x] OCR fallback badge visible for scanned images.
- [x] Extracted fields and confidence displayed; inline edits logged to correction history.
- [x] Embeddings created (deterministic mock) and search returns grounded snippets with sources.
- [x] Knowledge graph and timeline update from uploads.
- [x] Profile PDF export works; share copies URL and shows a link preview.
- [x] All interactive elements keyboard-accessible with visible `:focus-visible` rings.
- [x] README with architecture, run steps, honest mock disclosure and sample outputs.
- [ ] Demo GIF/video included (record from the live demo — see above).

## Built with

TanStack Start · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · jsPDF · Lucide
