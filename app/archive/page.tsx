import type { Metadata } from 'next'
import { getArticles, kindLabel } from '@/lib/articles'
import type { ArticleKind } from '@/lib/articles'
import { EntrainmentBackground } from '@/components/entrainment-background'
import { ArticleCard } from '@/components/article-card'
import {
  Breadcrumb,
  ModuleHeading,
  ReadingColumn,
  PackFooter,
} from '@/components/pack-chrome'

export const metadata: Metadata = {
  title: 'Source Archive — Wir Sind Drei',
  description:
    'The full run of sources feeding the case file: every read, watch, and listen, newest first.',
}

const KIND_ORDER: ArticleKind[] = ['read', 'watch', 'listen']

export default async function ArchivePage() {
  const articles = await getArticles()
  const counts = KIND_ORDER.map((k) => ({
    k,
    n: articles.filter((a) => a.kind === k).length,
  }))

  return (
    <>
      <EntrainmentBackground />
      <ReadingColumn>
        <Breadcrumb current="/archive" />

        <section className="mb-8">
          <ModuleHeading eyebrow="Archive · The Full Run">
            Every source, newest first.
          </ModuleHeading>
          <p className="max-w-[56ch] text-[15px] text-body">
            The feed on the front page keeps only the freshest few. This is where
            they all land — the complete case file, refreshed on the wire and
            de-duplicated. Consume it in transit and arrive fluent.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {counts.map((c) => (
              <span
                key={c.k}
                className="rounded-sm border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-mute"
              >
                {kindLabel(c.k)} · {c.n}
              </span>
            ))}
            <span className="rounded-sm border border-accent px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-accent">
              Total · {articles.length}
            </span>
          </div>
        </section>

        <section className="mb-9 grid gap-2.5">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </section>

        <PackFooter />
      </ReadingColumn>
    </>
  )
}
