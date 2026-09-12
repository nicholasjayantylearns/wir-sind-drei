import type { Article } from '@/lib/articles'
import { kindLabel } from '@/lib/articles'

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-sm border border-line p-3.5 transition-colors hover:border-accent focus-visible:border-accent"
    >
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-mute">
          {kindLabel(article.kind)} · {article.source}
        </span>
        <span className="shrink-0 font-mono text-[10px] text-mute">
          {article.curated ? 'Curated' : formatDate(article.publishedAt)}
        </span>
      </div>
      <div className="text-[14px] font-bold text-paper transition-colors group-hover:text-accent">
        {article.title}
      </div>
      <p className="mt-1 text-[13px] leading-relaxed text-mute-2">
        {article.summary}
      </p>
    </a>
  )
}
