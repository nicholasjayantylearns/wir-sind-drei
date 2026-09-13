'use client'

import Link from 'next/link'
import { useState } from 'react'

const PAGES = [
  { n: '01', label: 'Wir Sind Drei', href: '/' },
  { n: '02', label: 'The Walking Tour', href: '/tour' },
  { n: '03', label: 'Source Archive', href: '/archive' },
]

type Section = { id: string; label: string }

/* The single left navigation rail: cross-page links (01/02/03) plus the
   in-page section anchors for the current page, married to the entrainment
   ribbon rendered just to its right on desktop. On mobile it collapses into a
   hamburger that opens a full-width drawer sliding over the content. */
export function LeftRail({
  current,
  sections = [],
}: {
  current: string
  sections?: Section[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-40 flex flex-col gap-1 p-2 md:hidden"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
      >
        <span className="h-0.5 w-5 bg-paper" />
        <span className="h-0.5 w-5 bg-paper" />
        <span className="h-0.5 w-5 bg-paper" />
      </button>

      {/* Mobile full-width drawer sliding over the content */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-ink/95 backdrop-blur-md transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
            SATLINK // Navigation
          </span>
          <button
            onClick={close}
            aria-label="Close navigation menu"
            className="p-2"
          >
            <span className="relative block h-5 w-5">
              <span className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rotate-45 bg-paper" />
              <span className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 -rotate-45 bg-paper" />
            </span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-6">
          {sections.length > 0 && (
            <div className="mb-8">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                On this page
              </div>
              <div className="grid grid-cols-2 gap-x-4">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={close}
                    className="border-b border-line/60 py-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-body transition-colors hover:text-accent"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
              Pages
            </div>
            <div className="flex flex-col">
              {PAGES.map((p) => {
                const active = p.href === current
                return (
                  <Link
                    key={p.href}
                    href={p.href}
                    onClick={close}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-baseline gap-3 border-b border-line py-3 ${
                      active ? 'text-paper' : 'text-body'
                    }`}
                  >
                    <span className="font-mono text-[12px] text-accent">
                      {p.n}
                    </span>
                    <span className="text-[17px] font-bold">{p.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* Desktop unified rail */}
      <aside className="hidden md:fixed md:left-0 md:top-0 md:z-20 md:flex md:h-screen md:w-16 md:flex-col md:items-center md:gap-4 md:overflow-y-auto md:border-r md:border-line md:bg-ink/50 md:py-6 md:backdrop-blur-sm">
        {sections.length > 0 && (
          <>
            <nav
              aria-label="Section navigation"
              className="flex flex-col items-center gap-3"
            >
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="font-mono text-[9px] uppercase tracking-[0.1em] text-body transition-colors hover:text-paper"
                >
                  {s.label}
                </a>
              ))}
            </nav>
            <span className="h-px w-6 bg-line" />
          </>
        )}

        <div className="flex flex-col items-center gap-2">
          {PAGES.map((p) => {
            const active = p.href === current
            return (
              <Link
                key={p.href}
                href={p.href}
                aria-current={active ? 'page' : undefined}
                title={p.label}
                className={`flex h-8 w-8 items-center justify-center rounded-sm font-mono text-[10px] uppercase tracking-[0.08em] transition-colors ${
                  active
                    ? 'bg-accent font-bold text-ink'
                    : 'border border-line text-mute hover:border-accent hover:text-accent'
                }`}
              >
                {p.n}
              </Link>
            )
          })}
        </div>
      </aside>
    </>
  )
}
