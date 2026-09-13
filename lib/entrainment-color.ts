/* Standalone version of the entrainment gradient used by the axis clock, so
 * non-hook code (the map, plotting photos by their capture hour) can tint to
 * the same Recharge → Regroup → Recoup palette without reading the live clock. */

const STOPS: { pct: number; hex: string }[] = [
  { pct: 0, hex: "#dba847" },
  { pct: 14, hex: "#e8dfa0" },
  { pct: 32, hex: "#b9c4dd" },
  { pct: 48, hex: "#7a94d6" },
  { pct: 64, hex: "#3a5a9c" },
  { pct: 80, hex: "#8f6fb0" },
  { pct: 100, hex: "#c96f5a" },
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
