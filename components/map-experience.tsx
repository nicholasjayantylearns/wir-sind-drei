"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { PointOfInterest } from "@/lib/db/schema"
import { COORD_ONLY_POINTS, PHOTO_POINTS } from "@/lib/tour-coordinates"
import { addPoi } from "@/app/actions/poi"

const TourMap = dynamic(() => import("@/components/tour-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-ink/40">
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">Loading map…</span>
    </div>
  ),
})

export function MapExperience({ initialPois }: { initialPois: PointOfInterest[] }) {
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [picked, setPicked] = useState<{ lat: number; lng: number } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function startAdding() {
    setAdding(true)
    setError(null)
  }

  function cancel() {
    setAdding(false)
    setPicked(null)
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!picked) {
      setError("Click the map to drop a pin first.")
      return
    }
    setSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set("lat", String(picked.lat))
    formData.set("lng", String(picked.lng))

    const result = await addPoi(formData)
    setSubmitting(false)

    if (!result.ok) {
      setError(result.error ?? "Something went wrong.")
      return
    }

    cancel()
    router.refresh()
  }

  return (
    <div className="relative">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={adding ? cancel : startAdding}
          aria-pressed={adding}
          className={`rounded-sm px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
            adding
              ? "border border-line text-mute hover:border-accent hover:text-accent"
              : "bg-accent font-bold text-ink hover:opacity-90"
          }`}
        >
          {adding ? "Cancel" : "+ Add point of interest"}
        </button>
        {adding && (
          <span className="font-mono text-[11px] tracking-[0.04em] text-accent">
            {picked ? `Pinned · ${picked.lat.toFixed(4)}, ${picked.lng.toFixed(4)}` : "Click the map to drop a pin"}
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-sm border border-line">
        <div className="h-[62vh] min-h-[420px] w-full">
          <TourMap pois={initialPois} pickMode={adding} picked={picked} onPick={(lat, lng) => setPicked({ lat, lng })} />
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.1em] text-mute">
        <span className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-paper opacity-80" />
          {PHOTO_POINTS.length} with photo
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full border border-paper" />
          {COORD_ONLY_POINTS.length} coordinate-only
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--tourmap-accent)" }} />
          {initialPois.length} visitor pin{initialPois.length === 1 ? "" : "s"}
        </span>
        <span>Dot color = time of day shot</span>
      </div>

      {/* Add form */}
      {adding && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-sm border border-line bg-ink/40 p-4"
          aria-label="Add a point of interest"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">Name *</span>
              <input
                name="name"
                required
                maxLength={120}
                placeholder="e.g. Best currywurst in Kreuzberg"
                className="rounded-sm border border-line bg-ink/60 px-3 py-2 text-[14px] text-paper outline-none placeholder:text-mute focus:border-accent"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">Photo (optional)</span>
              <input
                name="image"
                type="file"
                accept="image/*"
                className="rounded-sm border border-line bg-ink/60 px-3 py-1.5 text-[13px] text-body outline-none file:mr-3 file:rounded-sm file:border-0 file:bg-accent file:px-3 file:py-1 file:font-mono file:text-[10px] file:uppercase file:tracking-[0.1em] file:text-ink focus:border-accent"
              />
            </label>
          </div>
          <label className="mt-3 flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">Note (optional)</span>
            <textarea
              name="note"
              rows={2}
              maxLength={400}
              placeholder="Why is this worth a stop?"
              className="resize-none rounded-sm border border-line bg-ink/60 px-3 py-2 text-[14px] text-paper outline-none placeholder:text-mute focus:border-accent"
            />
          </label>

          {error && <p className="mt-3 text-[13px] text-accent">{error}</p>}

          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting || !picked}
              className="rounded-sm bg-accent px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? "Saving…" : "Save point"}
            </button>
            <button
              type="button"
              onClick={cancel}
              className="font-mono text-[11px] uppercase tracking-[0.12em] text-mute transition-colors hover:text-paper"
            >
              Discard
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
