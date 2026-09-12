'use client'

/* Fixed anchor navigation. A left rail on desktop, a horizontal scroll strip on
   mobile. Matches the source export's TOP/FILE/WHY... tick list. */
const SECTIONS = [
  { id: 'top', label: 'TOP' },
  { id: 'feed', label: 'FEED' },
  { id: 'file', label: 'FILE' },
  { id: 'why', label: 'WHY' },
  { id: 'sound', label: 'SOUND' },
  { id: 'look', label: 'LOOK' },
  { id: 'money', label: 'MONEY' },
  { id: 'count', label: 'COUNT' },
  { id: 'clock', label: 'CLOCK' },
  { id: 'rule', label: 'RULE' },
  { id: 'week', label: 'WEEK' },
]

export function SectionRail() {
  return (
    <nav
      aria-label="Section navigation"
      className="fixed left-0 top-0 z-20 flex w-full flex-row items-stretch overflow-x-auto border-b border-line bg-ink/70 backdrop-blur-md md:bottom-0 md:top-0 md:h-full md:w-14 md:flex-col md:overflow-y-auto md:overflow-x-hidden md:border-b-0 md:border-r"
    >
      {SECTIONS.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={`flex shrink-0 items-center justify-center px-3 py-2.5 font-mono text-[9px] tracking-[0.1em] transition-colors md:px-0 md:py-3 ${
            i === 0
              ? 'text-accent'
              : 'text-mute hover:text-paper focus-visible:text-paper'
          }`}
        >
          <span className="whitespace-nowrap">{s.label}</span>
        </a>
      ))}
    </nav>
  )
}
