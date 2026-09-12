/* Server-side article ingestion for the source feed.
 *
 * Goal: keep the main-page feed feeling fresh by regularly pulling from a small
 * set of permitted, techno/Berlin-relevant sources, while always having curated
 * fallback content so the page never renders empty when a source is unavailable.
 *
 * Records are normalized to a single shape, de-duplicated by canonical URL, and
 * sorted newest-first. This module runs on the server only (see `server-only`).
 */
import 'server-only'

export type ArticleKind = 'read' | 'watch' | 'listen'

export interface Article {
  id: string
  title: string
  source: string
  url: string
  kind: ArticleKind
  summary: string
  publishedAt: string // ISO date
  curated?: boolean
}

/* Permitted feeds. Kept intentionally small and topical. If a fetch fails or
   returns nothing, we fall back to the curated seed set below. */
const PERMITTED_FEEDS: { source: string; url: string }[] = [
  {
    source: 'Resident Advisor',
    url: 'https://ra.co/xml/rss/news',
  },
]

/* Curated seed articles — the spine of the case file. The New Yorker piece the
   editor flagged leads the reading list and is always present. Dates are the
   originals' publish dates; curated items sort in among fetched ones by date. */
const CURATED: Article[] = [
  {
    id: 'newyorker-berghain-bouncer',
    title: 'Big, Bad Berghain: A Bouncer Shows Brooklyn His Berlin Portraits',
    source: 'The New Yorker',
    url: 'https://www.newyorker.com/magazine/2023/06/12/big-bad-berghain-bouncer-shows-brooklyn-his-berlin-portraits',
    kind: 'read',
    summary:
      "Sven Marquardt — the tattooed face at Berghain's door — brings his photography to Brooklyn. The definitive read on the man who decides who gets in, and the eye behind the stare.",
    publishedAt: '2023-06-12',
    curated: true,
  },
  {
    id: 'lives-of-others',
    title: 'The Lives of Others (2006)',
    source: 'Film · dir. Florian Henckel von Donnersmarck',
    url: 'https://www.imdb.com/title/tt0405094/',
    kind: 'watch',
    summary:
      'A Stasi surveillance officer, an East Berlin writer, and the wall between watching someone and becoming them. Watch this before anything else — everything in East Berlin reads differently after.',
    publishedAt: '2006-03-23',
    curated: true,
  },
  {
    id: 'berlin-detroit-alliance',
    title: 'Berlin and Detroit: An Alien Techno Alliance',
    source: 'Dancecult · Journal of Electronic Dance Music Culture',
    url: 'https://dj.dancecult.net/index.php/dancecult/article/view/554',
    kind: 'read',
    summary:
      "The scholarly case for how a Detroit sound and a divided city's youth built techno culture together after 1989 — the paper behind the \u201cWhy\u201d module.",
    publishedAt: '2013-11-01',
    curated: true,
  },
  {
    id: 'conversation-wall-techno',
    title: 'How Techno Music United Germany on the Dance Floor',
    source: 'The Conversation',
    url: 'https://theconversation.com/berlin-wall-how-techno-music-united-germany-on-the-dance-floor-126211',
    kind: 'read',
    summary:
      'The short version of the same story — the wall coming down and the floor going up in its place.',
    publishedAt: '2019-11-08',
    curated: true,
  },
  {
    id: 'rolling-stone-berghain-playlist',
    title: 'The Essential Berghain Playlist',
    source: 'Rolling Stone',
    url: 'https://www.rollingstone.com/music/music-lists/berghain-playlist-essential-tracks/',
    kind: 'listen',
    summary:
      "Ostgut Ton, Dettmann, Klock. Put this on for the flight — it's a better primer than any guide.",
    publishedAt: '2019-02-14',
    curated: true,
  },
  {
    id: 'guardian-berghain-power-plant',
    title: 'Inside Berghain: The Power Plant That Became Techno\u2019s Cathedral',
    source: 'The Guardian',
    url: 'https://www.theguardian.com/travel/2015/jun/05/berlin-berghain-nightclub-techno',
    kind: 'read',
    summary:
      'A former East German turbine hall with 60-foot ceilings, and how the room built for something enormous ended up holding techno.',
    publishedAt: '2015-06-05',
    curated: true,
  },
]

function canonicalUrl(url: string): string {
  try {
    const u = new URL(url)
    u.hash = ''
    u.search = ''
    return u.origin + u.pathname.replace(/\/$/, '')
  } catch {
    return url
  }
}

function dedupe(items: Article[]): Article[] {
  const seen = new Set<string>()
  const out: Article[] = []
  for (const item of items) {
    const key = canonicalUrl(item.url)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  return out
}

function sortNewestFirst(items: Article[]): Article[] {
  return [...items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

/* Best-effort parse of an RSS feed into normalized Articles. Deliberately
   tolerant: on any failure it returns [] and the curated set carries the feed. */
async function fetchFeed(feed: {
  source: string
  url: string
}): Promise<Article[]> {
  try {
    const res = await fetch(feed.url, {
      headers: { 'user-agent': 'WirSindDrei/1.0 (+context-pack)' },
      next: { revalidate: 60 * 30 }, // refresh at most every 30 min
    })
    if (!res.ok) return []
    const xml = await res.text()
    const items = xml.split(/<item[\s>]/i).slice(1)
    const parsed: Article[] = []
    for (const raw of items.slice(0, 12)) {
      const title = extractTag(raw, 'title')
      const link = extractTag(raw, 'link')
      const desc = extractTag(raw, 'description')
      const pub = extractTag(raw, 'pubDate')
      if (!title || !link) continue
      parsed.push({
        id: canonicalUrl(link),
        title: stripHtml(title),
        source: feed.source,
        url: link.trim(),
        kind: 'read',
        summary: stripHtml(desc).slice(0, 220),
        publishedAt: pub ? new Date(pub).toISOString() : new Date().toISOString(),
      })
    }
    return parsed
  } catch {
    return []
  }
}

function extractTag(block: string, tag: string): string {
  const cdata = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>`, 'i').exec(block)
  if (cdata) return cdata[1]
  const plain = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i').exec(block)
  return plain ? plain[1] : ''
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .trim()
}

/* Public API: the full, normalized, deduped, newest-first source list. */
export async function getArticles(): Promise<Article[]> {
  const fetched = (
    await Promise.all(PERMITTED_FEEDS.map((f) => fetchFeed(f)))
  ).flat()

  const combined = dedupe([...fetched, ...CURATED])
  return sortNewestFirst(combined)
}

/* The feed shown on the main page: freshest first, capped. */
export async function getFeed(limit = 5): Promise<Article[]> {
  return (await getArticles()).slice(0, limit)
}

export function kindLabel(kind: ArticleKind): string {
  return kind === 'watch' ? 'Watch' : kind === 'listen' ? 'Listen' : 'Read'
}
