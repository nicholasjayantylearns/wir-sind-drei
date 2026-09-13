import Link from 'next/link'
import { EntrainmentBackground } from '@/components/entrainment-background'
import { SectionRail } from '@/components/section-rail'
import { Breadcrumb, ReadingColumn, PackFooter } from '@/components/pack-chrome'

export default async function PostMortemPage() {
  return (
    <>
      <EntrainmentBackground />
      <SectionRail />
      <ReadingColumn>
        <div className="pt-10 md:pt-0">
          <Breadcrumb current="/post-mortem" />
        </div>

        {/* WIR SIND DREI hero — moved from homepage */}
        <section className="relative mb-10 overflow-hidden rounded border border-line bg-ink/60 px-7 pb-8 pt-9">
          <div className="pointer-events-none absolute right-0 top-0 leading-[0.8]">
            <div className="translate-x-[20%] -translate-y-[18%] whitespace-nowrap text-[110px] font-extrabold tracking-tight text-paper/[0.03]">
              THE BRIEF
            </div>
          </div>
          <div className="relative z-[1]">
            <div className="mb-4 font-mono text-[11px] tracking-[0.16em] text-accent">
              SATLINK // CONTEXT PACK · STATUS: LINKED
            </div>
            <h1 className="mb-4 text-[clamp(36px,8vw,58px)] font-extrabold leading-[1.02] tracking-tight text-paper">
              WIR SIND
              <br />
              DREI
            </h1>
            <p className="mb-1.5 max-w-[52ch] text-[17px] text-body">
              How three people who have never done this before get through one
              door in Friedrichshain.
            </p>
            <p className="max-w-[52ch] text-[14px] text-mute">
              Built for a first-time traveler in their seventies. No techno
              background required — just the pack.
            </p>
          </div>
        </section>

        <div className="mb-9">
          <Link
            href="/"
            className="inline-block rounded-sm border border-line px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-mute transition-colors hover:border-accent hover:text-accent"
          >
            ← Back to assignment
          </Link>
        </div>

        <PackFooter />
      </ReadingColumn>
    </>
  )
}
