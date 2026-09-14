# Runbook: Photo-Storage Cost Spike

Incident-response play for runaway cost on the points-of-interest photo stack
(**Vercel Blob** for files, **Neon Postgres** for pathnames/metadata, `/api/file`
proxy for serving). This is a decision guide — the mitigations are described here
so that responding is a matter of flipping a switch and deploying a known change,
not designing a fix under pressure.

---

## 1. Detection (trigger)

Primary signal is **account-level**, no app code required:

- **Vercel Spend Management** → set a monthly budget and an alert threshold
  (e.g. alert at 50% and 80% of budget). This watches Blob storage, operations,
  and data transfer together.
- Set it up: Vercel Dashboard → **Settings → Billing → Spend Management** →
  set amount + notification threshold (email / webhook).

Declare an incident when a budget alert fires **and** the burn rate is
accelerating (not just normal month-over-month growth).

---

## 2. Triage — which axis is spiking?

Open **Vercel Dashboard → Storage → (Blob store) → Usage** and identify the
dominant axis:

| Symptom | Likely axis | Root cause |
| --- | --- | --- |
| Simple operations + data transfer climbing | **Serving** | A POI's photos going viral; `/api/file` re-fetching private blobs on cache miss |
| Advanced operations climbing | **Uploads** | Burst of new photo uploads via `addPoi` |
| Storage GB climbing steadily | **Growth** | Accumulated photos never pruned |

Neon side: **Neon Console → Monitoring** for compute (CU-hours). Storage stays
tiny because only pathnames live in Postgres, so a Neon spike is almost always
query traffic, not data.

---

## 3. Response plays

### A. Serving spike (reads / transfer)
The proxy at `app/api/file/route.ts` currently serves with ETag caching but
short cache lifetime. Mitigation: lengthen CDN caching so repeat views are free
cache HITs instead of re-hitting the store.

- Change: set a long `Cache-Control` on the proxy response, e.g.
  `public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800`.
- Effect: repeat image views serve from Vercel's edge (free) instead of counting
  as simple operations + transfer.
- Risk: images are effectively immutable (path includes a timestamp), so long
  caching is safe.

### B. Upload / growth spike
Mitigation: rate-limit and cap per-user storage in the `addPoi` server action
(`app/actions/poi.ts`).

- Add a per-user uploads-per-hour limit and a per-user total-photo/byte quota;
  reject past the threshold with a clear error.
- The action already enforces 6 photos/POI and 8 MB/photo — this adds an
  aggregate cap on top.

### C. Circuit breaker (worst case)
Mitigation: a kill switch that disables **new uploads** while keeping existing
POIs fully readable.

- Gate the write path in `addPoi` behind an env flag (e.g.
  `UPLOADS_DISABLED=1`) that returns a "uploads temporarily paused" error.
- Reads/`/api/file` stay untouched, so the app degrades gracefully instead of
  going down.

---

## 4. Verify & stand down

1. Watch the spiking axis in the Blob usage dashboard return toward baseline.
2. Confirm the burn-rate alert stops re-firing.
3. Revert temporary flags (e.g. clear `UPLOADS_DISABLED`) once traffic normalizes.
4. Write a short note: what spiked, which play was run, what the new baseline is.

---

## 5. Notes for the responder

- All three mitigations (A/B/C) are **not yet implemented** — this doc is the
  decision layer. When an incident starts, implement the relevant play; because
  the change and its location are pre-identified here, it's a fast, low-risk
  deploy rather than an investigation.
- Biggest single lever is **play A (caching)** — it addresses the most likely
  spike (viral reads) with the lowest-risk change.
- If you want these pre-built as dormant, flag-gated code paths ahead of time,
  that's a follow-up — it trades a little upfront work for an even faster
  response.
