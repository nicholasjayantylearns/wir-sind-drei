import Link from 'next/link'
import { getFeed } from '@/lib/articles'
import { EntrainmentBackground } from '@/components/entrainment-background'
import { SectionRail } from '@/components/section-rail'
import { ArticleCard } from '@/components/article-card'
import { LevelLegend } from '@/components/level-legend'
import { TimeShift } from '@/components/time-shift'
import {
  Breadcrumb,
  ModuleHeading,
  ReadingColumn,
  PackFooter,
} from '@/components/pack-chrome'

export default async function HomePage() {
  const feed = await getFeed(5)

  return (
    <>
      <EntrainmentBackground />
      <SectionRail />
      <ReadingColumn>
        <div className="pt-10 md:pt-0">
          <Breadcrumb current="/" />
        </div>

        {/* Assignment — now the hero */}
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
            <h2 className="mb-4 text-[clamp(24px,6vw,42px)] font-extrabold leading-[1.02] tracking-tight text-paper">
              WIR SIND DREI
            </h2>
            <p className="mb-2.5 max-w-[52ch] text-[15px] text-paper">
              You&apos;re an investigative culture journalist, dropped into Berlin
              to cover the techno scene — but you&apos;ve never been exposed to it
              and you&apos;re not a fan. Your editor doesn&apos;t care. Stasi-era
              paranoia is back in the news, the wall&apos;s ghosts are everywhere,
              and somewhere at the end of this week is a door that will not let you
              in unless you&apos;ve actually done the work.
            </p>
            <p className="max-w-[52ch] text-[15px] text-body">
              Below is your case file: the reading, the listening, the viewing, the
              sites, in the order that builds the story. Consume it in transit —
              on the plane, in the S-Bahn — and arrive already fluent. The door on
              Saturday is the test.
            </p>
            <Link
              href="/post-mortem"
              className="mt-5 inline-block text-[13px] text-mute transition-colors hover:text-accent"
            >
              Learn about the three →
            </Link>
          </div>
        </section>

        {/* Live source feed */}
        <section className="mb-9">
          <ModuleHeading id="feed" eyebrow="Live · The Feed">
            Fresh from the source wire.
          </ModuleHeading>
          <p className="mb-3.5 text-[15px] text-body">
            New dispatches on the scene, refreshed on the wire and kept
            newest-first. The full run lives in the{' '}
            <Link
              href="/archive"
              className="text-accent underline-offset-2 hover:underline"
            >
              source archive
            </Link>
            .
          </p>
          <div className="grid gap-2.5">
            {feed.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <Link
            href="/archive"
            className="mt-4 inline-block rounded-sm border border-line px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-mute transition-colors hover:border-accent hover:text-accent"
          >
            Open the full archive →
          </Link>
        </section>

        {/* THE WHY */}
        <section className="mb-9">
          <ModuleHeading id="why" eyebrow="Context · The Why">
            People call it the church of techno. They mean it literally.
          </ModuleHeading>
          <p className="mb-2.5 text-[15px] text-body">
            Berghain is a former East German power plant — a raw concrete hall
            built to hold turbines, with ceilings nearly 60 feet up. The scale,
            the dark, the ritual at the door, the DJ booth positioned like an
            altar above the crowd: people reach for religious language because
            the room was built for something enormous, and techno is what moved
            in.
          </p>
          <p className="text-[15px] text-body">
            That reach isn&apos;t new. After 1989, East and West Berlin&apos;s
            youth met in the no-man&apos;s-land between them, and Detroit techno —
            foreign, wordless, tied to neither side&apos;s history — became the
            shared soundtrack. Abandoned East Berlin buildings turned into clubs;
            Tresor opened in a former bank vault in 1991. Berghain, opened in
            2004, carries that lineage.
          </p>
        </section>

        {/* THE SOUND */}
        <section className="mb-9">
          <ModuleHeading id="sound" eyebrow="Context · The Sound">
            Two floors, two moods.
          </ModuleHeading>
          <p className="mb-2.5 text-[15px] text-body">
            Downstairs is the main floor: austere, stripped-down techno, rigid
            kick drums, built for staring at a wall and disappearing into it.
            Upstairs is Panorama Bar: brighter, more soulful, disco- and
            house-leaning. Same building, same night, different register — pick a
            floor by mood, not obligation.
          </p>
          <p className="text-[15px] text-body">
            The house label is Ostgut Ton — residents Marcel Dettmann and Ben
            Klock define the downstairs sound. Listen to either before Saturday.
          </p>
        </section>

        {/* THE LOOK */}
        <section className="mb-9">
          <ModuleHeading id="look" eyebrow="Recharge · The Look">
            Not a costume. A uniform you already own.
          </ModuleHeading>
          <p className="mb-3.5 text-[15px] text-body">
            There&apos;s no written dress code. The convention is black — dark,
            unbranded, worn-in. The door reads intention, not effort.
          </p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[
              'All black',
              'No logos, no sportswear',
              'No heels, no suits',
              'Shoes already broken in',
            ].map((rule) => (
              <div
                key={rule}
                className="rounded-sm border border-line px-3.5 py-3 text-[13px] text-paper"
              >
                {rule}
              </div>
            ))}
          </div>
        </section>

        {/* THE MONEY */}
        <section className="mb-9">
          <ModuleHeading id="money" eyebrow="Recharge · The Money">
            Cards work now. Carry cash anyway.
          </ModuleHeading>
          <p className="text-[15px] text-body">
            Entry and the bar have taken cards since late 2025. Coat check is
            still cash — about €2.50. Re-entry is cash — about €5. Nearest ATMs:
            Warschauer Straße, Revaler Straße.
          </p>
        </section>

        {/* THE COUNT */}
        <section className="mb-9 rounded border border-line bg-panel p-6">
          <ModuleHeading id="count" eyebrow="Regroup · The Count">
            When they ask how many — lead with the thumb.
          </ModuleHeading>
          <p className="mb-4 text-[15px] text-body">
            German counting starts on the thumb. To signal three, raise thumb,
            index, and middle finger — not index, middle, and ring the way
            it&apos;s counted at home. Show it before you&apos;re asked; it reads
            as fluency, not performance.
          </p>
          <div className="border-t border-line pt-3.5">
            <div className="mb-1.5 font-mono text-[12px] uppercase tracking-[0.14em] text-mute">
              Say this at the door
            </div>
            <div className="text-[26px] font-extrabold text-paper">
              &ldquo;Wir sind drei.&rdquo;
            </div>
            <div className="mt-1 text-[14px] text-mute-2">
              veer zint dry — &ldquo;we are three&rdquo;
            </div>
          </div>
        </section>

        {/* THE CLOCK — time-shift schedule + level legend */}
        <section className="mb-9">
          <ModuleHeading id="clock" eyebrow="Regroup · The Clock">
            The door softens as the night gets older.
          </ModuleHeading>
          <TimeShift />
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {[
              { w: 'Sat 23:59–02:00', d: 'Longest line, hardest door' },
              { w: 'Sun 04:00–08:00', d: 'Shortest line, calmest door' },
              { w: 'Sun 12:00–18:00', d: 'Daylight, friendliest crowd' },
            ].map((slot) => (
              <div
                key={slot.w}
                className="rounded-sm border border-line p-3 text-center"
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-mute">
                  {slot.w}
                </div>
                <div className="mt-1.5 text-[13px] text-body">{slot.d}</div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
              The building, level by level
            </div>
            <LevelLegend />
          </div>
        </section>

        {/* THE ONE RULE */}
        <section className="mb-11 rounded border border-accent p-6">
          <div
            id="rule"
            className="mb-2.5 font-mono text-[12px] uppercase tracking-[0.16em] text-accent"
            style={{ scrollMarginTop: '80px' }}
          >
            Recoup · The One Rule
          </div>
          <h2 className="mb-2.5 text-[22px] font-bold text-paper">
            Your phone camera gets a sticker at the door.
          </h2>
          <p className="text-[15px] text-body">
            Don&apos;t peel it, don&apos;t test it. No photos, no video, no
            exceptions — that single rule is why everyone else in the room can let
            go. Leave the phone in a pocket and don&apos;t take it out.
          </p>
        </section>

        {/* THE WEEK */}
        <section className="mb-9">
          <ModuleHeading id="week" eyebrow="The Week · Sept 13–19">
            Base at Michelberger. Work up to Saturday.
          </ModuleHeading>
          <p className="mb-3 text-[15px] text-body">
            Michelberger Hotel — Warschauer Str. 39–40, Friedrichshain — a
            converted factory building five minutes on foot from Berghain. Home
            base for the week; everything below is walkable or one train stop from
            it.
          </p>
          <Link
            href="/tour"
            className="mb-4 inline-block rounded-sm border border-accent px-3.5 py-2 text-[13px] text-accent transition-colors hover:bg-accent hover:text-ink"
          >
            See the walking route for the crew, with GPS map links →
          </Link>
          <div className="grid gap-2.5">
            {[
              { d: 'Sun 13', t: 'Arrive. Check into Michelberger.', b: 'No plans. Let the jet lag pass in the courtyard bar.' },
              { d: 'Mon 14', t: 'East Side Gallery, then the DDR Museum.', b: 'The Wall, then everyday life on the other side of it. Grab a Club Mate from a Späti in Kreuzberg after.' },
              { d: 'Tue 15', t: 'Prenzlauer Berg market, then Mauerpark.', b: 'Market in the morning; flea market and Sunday karaoke at Mauerpark. Hard Wax in Kreuzberg after.' },
              { d: 'Wed 16', t: 'Neukölln by day, Kreuzberg by night.', b: 'Dinner at Bar Raval (part-owned by Daniel Brühl); one Club Mate at Madame Claude, a bar built upside-down on its ceiling.' },
              { d: 'Thu 17', t: 'Charlottenburg by day. Tresor by night.', b: 'Bougie West Berlin in daylight, then Tresor — an easier door than Berghain, the right place to practice the count.' },
              { d: 'Fri 18', t: 'Mitte, then Club der Visionaere.', b: 'Museums in the morning; a wooden deck over the Landwehrkanal by afternoon. The gentlest rehearsal for Saturday.' },
            ].map((row) => (
              <div
                key={row.d}
                className="grid grid-cols-[64px_1fr] gap-3.5 rounded-sm border border-line p-3.5"
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-mute">
                  {row.d}
                </div>
                <div>
                  <div className="text-[14px] font-bold text-paper">{row.t}</div>
                  <div className="text-[13px] text-mute-2">{row.b}</div>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-[64px_1fr] gap-3.5 rounded-sm border border-accent p-3.5">
              <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
                Sat 19
              </div>
              <div>
                <div className="text-[14px] font-bold text-paper">
                  Friedrichshain&apos;s church of techno: Berghain.
                </div>
                <div className="text-[13px] text-body">
                  Everything above was rehearsal for this door.
                </div>
              </div>
            </div>
          </div>
        </section>

        <PackFooter />
      </ReadingColumn>
    </>
  )
}
