'use client'

import Link from 'next/link'
import { useState } from 'react'

const PAGES = [
  { n: '01', label: 'Wir Sind Drei', href: '/' },
  { n: '02', label: 'The Walking Tour', href: '/tour' },
  { n: '03', label: 'Source Archive', href: '/archive' },
]

export function LeftRail({ current }: { current: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile hamburger menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 md:hidden flex flex-col gap-1 p-2"
        aria-label="Toggle navigation menu"
      >
        <div className={`h-0.5 w-5 bg-paper transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <div className={`h-0.5 w-5 bg-paper transition-all ${isOpen ? 'opacity-0' : ''}`} />
        <div className={`h-0.5 w-5 bg-paper transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink/80 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile menu drawer */}
      <div
        className={`fixed left-0 top-0 z-35 h-screen w-16 flex flex-col items-center border-r border-line bg-ink/95 backdrop-blur-sm transition-transform md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center px-2 py-8">
          {/* Breadcrumb anchors — the clock itself now lives in the shared
              entrainment ribbon rendered just to the right of this rail,
              so the rail and the clock read as one married object */}
          <div className="flex flex-col items-center gap-3">
            {PAGES.map((p) => {
              const active = p.href === current
              return (
                <Link
                  key={p.href}
                  href={p.href}
                  onClick={() => setIsOpen(false)}
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
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-16 md:flex md:flex-col md:items-center md:justify-center md:border-r md:border-line md:bg-ink/50 md:backdrop-blur-sm">
        <div className="flex h-full flex-col items-center justify-center px-1 py-8">
          {/* Breadcrumb anchors — the clock itself now lives in the shared
              entrainment ribbon rendered just to the right of this rail,
              so the rail and the clock read as one married object */}
          <div className="flex flex-col items-center gap-3">
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
    </>
  )
}
