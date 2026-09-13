'use client'

import { useEffect, useState } from 'react'

/* Same stops as the vertical axis gradient in EntrainmentBackground —
   Recharge (warm gold) at 00:00, cooling through Regroup steel, to
   Recoup coral by end of day. Kept in one place so the "now" marker,
   the tinted field, and any dynamic type all read off the same clock. */
const STOPS: { pct: number; hex: string }[] = [
  { pct: 0, hex: '#dba847' },
  { pct: 14, hex: '#e8dfa0' },
  { pct: 32, hex: '#b9c4dd' },
  { pct: 48, hex: '#7a94d6' },
  { pct: 64, hex: '#3a5a9c' },
  { pct: 80, hex: '#8f6fb0' },
  { pct: 100, hex: '#c96f5a' },
]

function hexToRgb(hex: string) {
  const n = Number.parseInt(hex.slice(1), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  const c = (v: number) => Math.round(v).toString(16).padStart(2, '0')
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
  return {
    r: lerp(a.r, b.r, t),
    g: lerp(a.g, b.g, t),
    b: lerp(a.b, b.b, t),
  }
}

/* WCAG relative luminance — decides whether ink or paper reads better
   against the current time-of-day color. */
function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  const srgb = [r, g, b].map((v) => v / 255)
  const lin = srgb.map((v) =>
    v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
  )
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
}

export interface EntrainmentClockState {
  /** Fractional hour, 0–24 (e.g. 14.5 for 14:30). */
  hour: number
  /** Position along the 24h axis, 0–100. */
  pct: number
  /** The gradient color at this moment. */
  hex: string
  /** True when the moment's color is light enough to need dark (ink) type. */
  isLight: boolean
}

function computeState(date: Date): EntrainmentClockState {
  const hour = date.getHours() + date.getMinutes() / 60
  const pct = (hour / 24) * 100
  const rgb = colorAtPercent(pct)
  const hex = rgbToHex(rgb)
  const isLight = relativeLuminance(rgb) > 0.45
  return { hour, pct, hex, isLight }
}

/**
 * Reads the real local clock and returns where "now" sits on the
 * Recharge → Regroup → Recoup 24h axis, plus the color at that point.
 * Also mirrors the result onto CSS variables on <html> (--entrain-now,
 * --entrain-now-fg) so any element on the page can react to the live
 * time-of-day color, not just components that call this hook directly.
 * Returns null until mounted, to avoid a server/client time mismatch.
 */
export function useEntrainmentClock(): EntrainmentClockState | null {
  const [state, setState] = useState<EntrainmentClockState | null>(null)

  useEffect(() => {
    const tick = () => {
      const next = computeState(new Date())
      setState(next)
      const root = document.documentElement
      root.style.setProperty('--entrain-now', next.hex)
      root.style.setProperty(
        '--entrain-now-fg',
        next.isLight ? 'var(--color-ink)' : 'var(--color-paper)',
      )
    }
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [])

  return state
}
