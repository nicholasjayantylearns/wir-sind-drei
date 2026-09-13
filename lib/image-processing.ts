import exifr from "exifr"

/* Client-side photo prep for visitor points of interest.

   Order matters: canvas re-encoding strips all EXIF metadata, so the capture
   hour MUST be read from the original file BEFORE compression. */

const MAX_EDGE = 1600 // longest side, px — plenty for a map popup
const JPEG_QUALITY = 0.82

export interface ProcessedPhoto {
  blob: Blob
  /* Local capture hour (0–23) from EXIF, or null when the photo carries no
     usable timestamp (screenshots, stripped uploads, etc.). */
  takenHour: number | null
}

/* Read the local capture hour from EXIF DateTimeOriginal. exifr returns a JS
   Date in local time; we only keep the hour for entrainment tinting. */
async function readCaptureHour(file: File): Promise<number | null> {
  try {
    const parsed = await exifr.parse(file, ["DateTimeOriginal", "CreateDate"])
    const when: Date | undefined = parsed?.DateTimeOriginal ?? parsed?.CreateDate
    if (when instanceof Date && !Number.isNaN(when.getTime())) {
      return when.getHours()
    }
  } catch {
    // Unreadable/absent EXIF is expected for many images — not an error.
  }
  return null
}

/* Downscale + re-encode to JPEG via canvas. Returns the original file
   untouched if anything goes wrong so an upload never silently fails. */
async function compress(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    )
    // Only take the compressed result if it's actually smaller.
    if (blob && blob.size < file.size) return blob
    return file
  } catch {
    return file
  }
}

export async function processPhoto(file: File): Promise<ProcessedPhoto> {
  const takenHour = await readCaptureHour(file)
  const blob = await compress(file)
  return { blob, takenHour }
}
