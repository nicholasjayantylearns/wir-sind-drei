import Link from 'next/link'

const PAGES = [
  { n: '01', label: 'Wir Sind Drei', href: '/' },
  { n: '02', label: 'The Walking Tour', href: '/tour' },
  { n: '03', label: 'Source Archive', href: '/archive' },
]

export function LeftRail({ current }: { current: string }) {
  return (
    <aside className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-20 md:flex md:flex-col md:items-center md:border-r md:border-line md:bg-ink/50 md:backdrop-blur-sm">
      {/* 24-hour clock axis */}
      <div className="flex h-full flex-col items-center justify-between px-2 py-8">
        {/* Clock visualization: vertical axis with hour markers */}
        <div className="relative flex flex-col items-center" style={{ height: 'calc(100% - 64px)' }}>
          {/* Vertical spine */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-recharge via-regroup to-recoup" />

          {/* Hour markers */}
          <div className="relative w-full flex-1 flex flex-col justify-between py-4">
            {[
              { hour: '00', label: 'Midnight' },
              { hour: '06', label: 'Dawn' },
              { hour: '12', label: 'Noon' },
              { hour: '18', label: 'Dusk' },
              { hour: '24', label: 'Midnight' },
            ].map((mark) => (
              <div key={mark.hour} className="relative flex w-full items-center justify-center">
                <div className="absolute left-1/4 h-px w-1/2 bg-line" />
                <div className="text-[9px] uppercase tracking-[0.08em] text-mute font-mono">
                  {mark.hour}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breadcrumb anchors vertically stacked */}
        <div className="flex flex-col items-center gap-3 border-t border-line pt-4">
          {PAGES.map((p) => {
            const active = p.href === current
            return (
              <Link
                key={p.href}
                href={p.href}
                aria-current={active ? 'page' : undefined}
                title={p.label}
                className={`flex h-8 w-8 items-center justify-center rounded-sm text-[10px] font-mono uppercase tracking-[0.08em] transition-colors ${
                  active
                    ? 'bg-accent text-ink font-bold'
                    : 'border border-line text-mute hover:border-accent hover:text-accent'
                }`}
              >
                {p.n}
              </Link>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
