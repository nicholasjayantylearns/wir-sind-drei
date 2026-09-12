/* The layered venue legend, from the architectural section reference:
   Level 1 ground services, Level 2 recovery, Level 3 where the magic happens. */
const LEVELS = [
  {
    level: 'Level 1',
    tone: 'text-accent',
    title: 'Ground',
    items: ['Bag Check', 'Bar', 'Circadian Lounge', 'DJ Concierge', 'Commissary'],
  },
  {
    level: 'Level 2',
    tone: 'text-steel-3',
    title: 'Recover',
    items: ['Soaks', 'Naps', 'Shared Locker'],
  },
  {
    level: 'Level 3',
    tone: 'text-steel-2',
    title: 'Where the magic happens',
    items: ['Bar', 'Lookout Area'],
  },
]

export function LevelLegend() {
  return (
    <div className="grid gap-2.5 sm:grid-cols-3">
      {LEVELS.map((l) => (
        <div key={l.level} className="rounded-sm border border-line bg-ink/30 p-3.5">
          <div className={`font-mono text-[11px] uppercase tracking-[0.1em] ${l.tone}`}>
            {l.level}
          </div>
          <div className="mb-2 mt-0.5 text-[13px] font-bold text-paper">
            {l.title}
          </div>
          <ul className="space-y-1">
            {l.items.map((item) => (
              <li key={item} className="text-[13px] text-body">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
