import Link from 'next/link'
import type { ReactNode } from 'react'

/* Shared chrome for every page in the pack: the centered dark reading column,
   the numbered cross-page breadcrumb, module headings, and the footer. */

const PAGES = [
  { n: '01', label: 'Wir Sind Drei', href: '/' },
  { n: '02', label: 'The Walking Tour', href: '/tour' },
  { n: '03', label: 'Source Archive', href: '/archive' },
]

export function Breadcrumb({ current }: { current: string }) {
  return (
    <div
      id="top"
      className="mb-8 flex flex-wrap gap-x-5 gap-y-3 border-b border-line pb-4 font-mono text-[11px] uppercase tracking-[0.1em]"
    >
      {PAGES.map((p) => {
        const active = p.href === current
        return (
          <Link
            key={p.href}
            href={p.href}
            aria-current={active ? 'page' : undefined}
            className={
              active
                ? 'whitespace-nowrap text-accent'
                : 'whitespace-nowrap text-mute transition-colors hover:text-paper'
            }
          >
            {p.n} · {p.label}
          </Link>
        )
      })}
    </div>
  )
}

export function ModuleHeading({
  id,
  eyebrow,
  children,
}: {
  id?: string
  eyebrow: string
  children: ReactNode
}) {
  return (
    <>
      <div className="mb-2.5 flex items-center gap-2.5">
        <span className="pulse-dot h-2 w-2 shrink-0 rounded-full bg-accent" />
        <div
          id={id}
          className="text-[12px] uppercase tracking-[0.16em] text-mute"
          style={{ scrollMarginTop: '80px' }}
        >
          {eyebrow}
        </div>
      </div>
      <h2 className="mb-2.5 text-balance text-[22px] font-bold leading-tight text-paper">
        {children}
      </h2>
    </>
  )
}

export function ReadingColumn({ children }: { children: ReactNode }) {
  return (
    <main className="relative z-0 mx-auto box-border max-w-[720px] px-5 py-14 leading-relaxed md:px-8 md:pl-20">
      {children}
    </main>
  )
}

export function PackFooter() {
  return (
    <footer className="mt-10 border-t border-line pt-6">
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
        SATLINK // Context pack · Status: linked
      </div>
      <p className="mt-3 max-w-[52ch] text-[13px] text-mute-2">
        Built for a first-time traveler in their seventies and a crew of merry
        makers. No techno background required — just the pack. Recharge, Regroup,
        Recoup.
      </p>
    </footer>
  )
}
