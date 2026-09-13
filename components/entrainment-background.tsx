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
        background: `radial-gradient(120% 90% at 50% 0%, color-mix(in srgb, ${nowColor} 16%, #363230) 0%, color-mix(in srgb, ${nowColor} 10%, #2b2825) 45%, #1a1816 100%)`,
      }}
    >
      {/* the entrainment axis: the unrolled wheel as a vertical clock/timeline */}
      <div className="absolute inset-y-0 left-1/2 flex w-[46vmin] -translate-x-1/2 items-stretch justify-center md:w-[30vmin]">
        {/* soft glow bloom around the axis, tinted toward the current hour */}
        <div
          className="entrain-glow absolute inset-y-0 left-1/2 w-[70%] -translate-x-1/2 blur-3xl transition-colors duration-[3000ms]"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, ${nowColor} ${Math.max(0, nowPct - 18)}%, ${nowColor} ${Math.min(100, nowPct + 18)}%, transparent 100%), ${axisGradient}`,
            backgroundBlendMode: 'screen',
            opacity: 0.28,
          }}
        />
        {/* the defined gradient spine, faded top and bottom into the field */}
        <div
          className="entrain-axis absolute inset-y-0 left-1/2 w-[3.2vmin] -translate-x-1/2 md:w-[2vmin]"
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
            majors every 6h are labeled 00 / 06 / 12 / 18 / 24 */}
        <div className="absolute inset-y-[10%] left-1/2 -translate-x-1/2">
          <div className="relative h-full">
            {ticks.map((_, hour) => {
              const top = (hour / 24) * 100
              const major = hour % 6 === 0
              return (
                <div
                  key={hour}
                  className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center"
                  style={{ top: `${top}%` }}
                >
                  <span
                    className="rounded-full bg-paper/70"
                    style={{
                      height: '1.5px',
                      width: major ? '6.5vmin' : '3.5vmin',
                      opacity: major ? 0.82 : 0.42,
                    }}
                  />
                  {major && (
                    <span
                      className="absolute left-full ml-2 font-mono text-[10px] tabular-nums text-paper/55"
                      style={{ letterSpacing: '0.08em' }}
                    >
                      {String(hour).padStart(2, '0')}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* the "now" marker: where the real clock sits on the axis right now */}
        {clock && (
          <div
            className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center"
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
              className="absolute right-full mr-2 whitespace-nowrap rounded-sm px-1.5 py-0.5 font-mono text-[10px] tabular-nums transition-colors duration-[3000ms]"
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

      {/* soft vignette + bottom fade so long-form text stays legible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 100% at 50% 8%, transparent 30%, rgba(20,18,16,0.55) 62%, rgba(20,18,16,0.92) 100%)',
        }}
      />
    </div>
  )
}
