/* Standalone version of the entrainment gradient used by the axis clock, so
 * non-hook code (the map, plotting photos by their capture hour) can tint to
 * the same palette without reading the live clock. Keyed to the real hour:
 * BLUE alertness light across the rave night (23:00 -> 06:00), warming to
 * ORANGE come-down / calm at midday (12:00). */

const STOPS: { pct: number; hex: string }[] = [
  { pct: 0, hex: "#2f66a8" }, // 00:00 blue — alertness
  { pct: 25, hex: "#2f66a8" }, // 06:00 still blue — held through the night
  { pct: 38, hex: "#8a8290" }, // mid-morning, cooling out of blue
  { pct: 50, hex: "#d67a3c" }, // 12:00 orange — come-down / calm
  { pct: 62, hex: "#b0795d" }, // early afternoon, still warm
  { pct: 75, hex: "#6a6f9a" }, // 18:00 drifting back toward blue
  { pct: 96, hex: "#2f66a8" }, // 23:00 blue again — ramp into the night
  { pct: 100, hex: "#2f66a8" }, // 24:00 = 00:00
]

function hexToRgb(hex: string) {
  const n = Number.parseInt(hex.slice(1), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  const c = (v: number) => Math.round(v).toString(16).padStart(2, "0")
  return `#${c(r)}${c(g)}${c(b)}`
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function colorAtPercent(pct: number) {
  const clamped = Math.max(0, Math.min(100, pct))
  let lo = STOPS[0]
  let hi = STOPS[STOPS.length - 1]
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (clamped >= STOPS[i].pct && clamped <= STOPS[i + 1].pct) {
      lo = STOPS[i]
      hi = STOPS[i + 1]
      break
    }
  }
  const span = hi.pct - lo.pct || 1
  const t = (clamped - lo.pct) / span
  const a = hexToRgb(lo.hex)
  const b = hexToRgb(hi.hex)
  return { r: lerp(a.r, b.r, t), g: lerp(a.g, b.g, t), b: lerp(a.b, b.b, t) }
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  const srgb = [r, g, b].map((v) => v / 255)
  const lin = srgb.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
}

export interface HourColor {
  hex: string
  isLight: boolean
}

/* Map a fractional hour (0–24) onto the entrainment gradient. */
export function colorForHour(hour: number): HourColor {
  const pct = (Math.max(0, Math.min(24, hour)) / 24) * 100
  const rgb = colorAtPercent(pct)
  return { hex: rgbToHex(rgb), isLight: relativeLuminance(rgb) > 0.45 }
}
