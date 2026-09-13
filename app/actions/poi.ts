"use server"

import { put } from "@vercel/blob"
import { desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { pointsOfInterest, type PointOfInterest } from "@/lib/db/schema"

export interface PoiResult {
  ok: boolean
  error?: string
}

/* Read every visitor-submitted point. Degrades to an empty list if the
   database isn't reachable yet (e.g. DATABASE_URL still provisioning) so the
   map's static field photos always render. */
export async function listPois(): Promise<PointOfInterest[]> {
  try {
    return await db.select().from(pointsOfInterest).orderBy(desc(pointsOfInterest.createdAt))
  } catch (err) {
    console.error("[v0] listPois failed:", err)
    return []
  }
}

export async function addPoi(formData: FormData): Promise<PoiResult> {
  const name = String(formData.get("name") ?? "").trim()
  const note = String(formData.get("note") ?? "").trim()
  const lat = Number(formData.get("lat"))
  const lng = Number(formData.get("lng"))
  const image = formData.get("image")

  if (!name) return { ok: false, error: "A name is required." }
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { ok: false, error: "Pick a location on the map first." }
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return { ok: false, error: "Those coordinates are off the map." }
  }

  let imageUrl: string | null = null
  try {
    if (image instanceof File && image.size > 0) {
      if (!image.type.startsWith("image/")) {
        return { ok: false, error: "That file isn't an image." }
      }
      if (image.size > 8 * 1024 * 1024) {
        return { ok: false, error: "Image must be under 8 MB." }
      }
      const safeName = image.name.replace(/[^a-zA-Z0-9._-]/g, "_")
      const blob = await put(`poi/${Date.now()}-${safeName}`, image, { access: "private" })
      // Store the pathname; served back through /api/file for the private store.
      imageUrl = blob.pathname
    }

    await db.insert(pointsOfInterest).values({
      name,
      note: note || null,
      lat,
      lng,
      imageUrl,
    })
  } catch (err) {
    console.error("[v0] addPoi failed:", err)
    return { ok: false, error: "Could not save the point. Please try again." }
  }

  revalidatePath("/map")
  return { ok: true }
}
