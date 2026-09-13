'use client'

import { useEntrainmentClock } from '@/hooks/use-entrainment-clock'

/* The background IS the entrainment tool: a warm charcoal field with the
   color wheel "unrolled" into a vertical gradient axis — a clock/timeline
   running down the page, oriented to the Recharge -> Regroup -> Recoup
   palette (warm recharge at top, cooling as it descends). The 24 ring dots
   become 24 tick marks along the axis: a 24-hour clock unrolled into a spine.
   The axis is driven by the real local clock: a "now" marker sits at the
   current hour, the field is tinted toward that hour's color, and the
   marker's own label flips ink/paper for contrast against it. Fixed behind
   all content, non-interactive, and fully still under prefers-reduced-motion
   (handled in globals.css). */
export function EntrainmentBackground() {
  const ticks = Array.from({ length: 24 })
  const clock = useEntrainmentClock()

  // Recharge (warm gold) at top, cooling through steel, to Recoup at the base.
  const axisGradient =
    'linear-gradient(to bottom, #dba847 0%, #e8dfa0 14%, #b9c4dd 32%, #7a94d6 48%, #3a5a9c 64%, #8f6fb0 80%, #c96f5a 100%)'

  const nowColor = clock?.hex ?? '#3a5a9c'
  const nowPct = clock?.pct ?? 50

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden transition-colors duration-[3000ms]"
      style={{
        // The field IS the current hour's color, at full strength — a single
        // hue that drifts slowly across the day so the page can be entrained
        // to. Text legibility is handled by flipping type ink/paper against
        // it (--entrain-now-fg), not by diluting the color.
        backgroundColor: nowColor,
      }}
    >
      {/* the entrainment axis: the unrolled wheel as a vertical clock/timeline,
          married directly to the right edge of the fixed left nav rail on
          desktop so the rail and the clock read as one object */}
      <div className="absolute inset-y-0 left-4 flex w-24 items-stretch justify-start md:left-16 md:w-28">
        {/* soft glow bloom around the axis, tinted toward the current hour */}
        <div
          className="entrain-glow absolute inset-y-0 left-0 w-24 blur-3xl transition-colors duration-[3000ms]"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, ${nowColor} ${Math.max(0, nowPct - 18)}%, ${nowColor} ${Math.min(100, nowPct + 18)}%, transparent 100%), ${axisGradient}`,
            backgroundBlendMode: 'screen',
            opacity: 0.28,
          }}
        />
        {/* the defined gradient spine, faded top and bottom into the field —
            flush against the left rail's right edge on desktop */}
        <div
          className="entrain-axis absolute inset-y-0 left-0 w-[2.4vmin] md:w-[2vmin]"
          style={{
            background: axisGradient,
            opacity: 0.82,
            maskImage:
              'linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)',
          }}
        />
        {/* the 24-hour clock unrolled: hour ticks span the full spine,
            majors every 6h are labeled 00 / 06 / 12 / 18 / 24 — ticks and
            labels are left-justified against the spine on desktop */}
        <div className="absolute inset-y-[10%] left-0">
          <div className="relative h-full">
            {ticks.map((_, hour) => {
              const top = (hour / 24) * 100
              const major = hour % 6 === 0
              return (
                <div
                  key={hour}
                  className="absolute left-0 flex -translate-y-1/2 items-center"
                  style={{ top: `${top}%` }}
                >
                  <span
                    className="rounded-full"
                    style={{
                      height: '1.5px',
                      width: major ? '6.5vmin' : '3.5vmin',
                      backgroundColor: 'var(--entrain-now-fg)',
                      opacity: major ? 0.7 : 0.35,
                    }}
                  />
                  {major && (
                    <span
                      className="absolute left-full ml-2 hidden font-mono text-[10px] tabular-nums md:inline"
                      style={{
                        letterSpacing: '0.08em',
                        color: 'var(--entrain-now-fg)',
                        opacity: 0.5,
                      }}
                    >
                      {String(hour).padStart(2, '0')}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* the "now" marker: where the real clock sits on the axis right
            now — dot flush on the spine, label reads off to the right */}
        {clock && (
          <div
            className="absolute left-0 flex -translate-y-1/2 items-center"
            style={{ top: `${nowPct}%` }}
          >
            <span
              className="entrain-marker-pulse block rounded-full shadow-[0_0_10px_currentColor]"
              style={{
                height: '9px',
                width: '9px',
                backgroundColor: nowColor,
                color: nowColor,
              }}
            />
            <span
              className="absolute left-full ml-2 hidden whitespace-nowrap rounded-sm px-1.5 py-0.5 font-mono text-[10px] tabular-nums transition-colors duration-[3000ms] md:inline-block"
              style={{
                backgroundColor: nowColor,
                color: clock.isLight ? '#141210' : '#ededea',
                letterSpacing: '0.06em',
              }}
            >
              NOW ·{' '}
              {String(Math.floor(clock.hour)).padStart(2, '0')}:
              {String(Math.round((clock.hour % 1) * 60)).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

    </div>
  )
}
