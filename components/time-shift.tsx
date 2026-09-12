'use client'

import { useEffect, useState } from 'react'

/* The time-shifted operating rhythm: full services run 5pm -> 9am for guests
   living on a shifted clock. Presented as an accessible schedule table rather
   than relying on the reference imagery. A small live-time recommendation
   updates client-side without blocking render. */

const BLOCKS = [
  { window: '17:00 – 21:00', phase: 'Recharge', note: 'Wake, soak, slow start' },
  { window: '21:00 – 01:00', phase: 'Regroup', note: 'Commissary, DJ concierge, set the plan' },
  { window: '01:00 – 05:00', phase: 'Peak', note: 'Where the magic happens' },
  { window: '05:00 – 09:00', phase: 'Recoup', note: 'Naps, lookout, wind down' },
]

function phaseForHour(h: number): string {
  if (h >= 17 && h < 21) return 'Recharge'
  if ((h >= 21 && h <= 23) || h < 1) return 'Regroup'
  if (h >= 1 && h < 5) return 'Peak'
  if (h >= 5 && h < 9) return 'Recoup'
  return 'Off-clock'
}

export function TimeShift() {
  const [now, setNow] = useState<{ label: string; phase: string } | null>(null)

  useEffect(() => {
    function update() {
      // Berlin local time regardless of the visitor's timezone.
      const berlin = new Date(
        new Date().toLocaleString('en-US', { timeZone: 'Europe/Berlin' }),
      )
      const h = berlin.getHours()
      setNow({
        label: berlin.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        phase: phaseForHour(h),
      })
    }
    update()
    const t = setInterval(update, 30_000)
    return () => clearInterval(t)
  }, [])

  return (
    <div>
      <p className="mb-3 text-[15px] text-body">
        The scene runs on a shifted clock — full services between{' '}
        <span className="text-paper">5pm and 9am</span>, matching the
        time-shifted lifestyle of the crowd. Start entrainment Saturday
        afternoon, not at midnight.
      </p>

      <div className="overflow-hidden rounded-sm border border-line">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Time-shifted service windows and their phase
          </caption>
          <thead>
            <tr className="border-b border-line bg-ink/40">
              <th className="p-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-mute">
                Window (Berlin)
              </th>
              <th className="p-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-mute">
                Phase
              </th>
              <th className="p-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-mute">
                What&apos;s open
              </th>
            </tr>
          </thead>
          <tbody>
            {BLOCKS.map((b) => {
              const active = now?.phase === b.phase
              return (
                <tr
                  key={b.window}
                  className={`border-b border-line last:border-0 ${
                    active ? 'bg-accent/10' : ''
                  }`}
                >
                  <td className="p-2.5 font-mono text-[12px] text-body">
                    {b.window}
                  </td>
                  <td
                    className={`p-2.5 text-[13px] font-bold ${
                      active ? 'text-accent' : 'text-paper'
                    }`}
                  >
                    {b.phase}
                    {active ? ' ·' : ''}
                  </td>
                  <td className="p-2.5 text-[13px] text-mute-2">{b.note}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-mute" aria-live="polite">
        {now
          ? `Now in Berlin · ${now.label} · phase: ${now.phase}`
          : 'Syncing Berlin local time…'}
      </p>
    </div>
  )
}
