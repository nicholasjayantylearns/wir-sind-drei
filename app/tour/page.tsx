import type { Metadata } from 'next'
import { TOUR_STOPS, FIELD_PHOTOS, osmLink, formatTakenAt } from '@/lib/tour'
import { EntrainmentBackground } from '@/components/entrainment-background'
import {
  Breadcrumb,
  ModuleHeading,
  ReadingColumn,
  PackFooter,
} from '@/components/pack-chrome'

export const metadata: Metadata = {
  title: 'The Walking Tour — Wir Sind Drei',
  description:
    'A gently paced Berlin walking route for a septuagenarian crew of merry makers, with GPS map links and field photos pinned by location.',
}

export default function TourPage() {
  return (
    <>
      <EntrainmentBackground />
      <ReadingColumn>
        <Breadcrumb current="/tour" />

        <section className="mb-8">
          <ModuleHeading eyebrow="Route · The Walking Tour">
            Built for a crew of merry makers in their seventies.
          </ModuleHeading>
          <p className="max-w-[58ch] text-[15px] text-body">
            Short legs between sit-downs, a café or bench in every segment, one
            train stop instead of a long walk where it spares the legs, and an
            accessible regrouping point at each stop. Seven stops, paced across a
            day, ending at the door on Saturday. Every stop links to its exact
            spot on the map.
          </p>
        </section>

        {/* Route list */}
        <section className="mb-10">
          <ol className="relative ml-3 border-l border-line">
            {TOUR_STOPS.map((stop) => (
              <li key={stop.id} className="mb-6 ml-5">
                <span className="absolute -left-[7px] mt-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-accent bg-ink">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                <div className="rounded-sm border border-line bg-ink/30 p-4">
                  <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent">
                      Stop {stop.order} · {stop.arrive}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-mute">
                      {stop.neighborhood}
                    </span>
                  </div>
                  <h3 className="text-[17px] font-bold text-paper">
                    {stop.name}
                  </h3>
                  <p className="mt-1.5 text-[14px] text-body">{stop.segment}</p>
                  <p className="mt-1.5 text-[13px] text-mute-2">
                    <span className="text-paper">Rest:</span> {stop.rest}
                  </p>
                  <p className="mt-1 text-[13px] text-mute-2">
                    <span className="text-paper">Mobility:</span>{' '}
                    {stop.mobility}
                  </p>
                  {stop.detour ? (
                    <p className="mt-1 text-[13px] text-mute-2">
                      <span className="text-paper">Optional:</span>{' '}
                      {stop.detour}
                    </p>
                  ) : null}

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <a
                      href={osmLink(stop.lat, stop.lon)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-sm border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-mute transition-colors hover:border-accent hover:text-accent"
                    >
                      Open on map ↗
                    </a>
                    <span className="font-mono text-[10px] text-mute">
                      {stop.lat.toFixed(4)}, {stop.lon.toFixed(4)}
                    </span>
                  </div>

                  {stop.photo ? (
                    <figure className="mt-3 overflow-hidden rounded-sm border border-line">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={stop.photo.src || '/placeholder.svg'}
                        alt={stop.photo.caption}
                        className="h-48 w-full object-cover"
                        loading="lazy"
                      />
                      <figcaption className="bg-ink/50 p-2.5 text-[12px] text-mute-2">
                        {stop.photo.caption}
                        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.08em] text-mute">
                          {stop.photo.hasExif
                            ? `GPS from photo EXIF${
                                formatTakenAt(stop.photo.takenAt)
                                  ? ` · ${formatTakenAt(stop.photo.takenAt)}`
                                  : ''
                              }`
                            : 'No EXIF GPS · shown without a pin'}
                        </span>
                      </figcaption>
                    </figure>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Field photo GPS index */}
        <section className="mb-9">
          <ModuleHeading eyebrow="Field Photos · GPS Index">
            The map, pinned from the photos in the pack.
          </ModuleHeading>
          <p className="mb-4 max-w-[58ch] text-[15px] text-body">
            Each field photo in the Berlin context pack is plotted below from the
            latitude and longitude read out of its own EXIF metadata, hyperlinked
            to that exact spot on the map, and stamped with the moment it was
            shot. Coordinates are never invented — the one photo with no embedded
            GPS is shown plainly without a pin. Drop more geotagged photos into
            the pack and they slot into the same index.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {FIELD_PHOTOS.map((photo) => (
              <figure
                key={photo.file}
                className="overflow-hidden rounded-sm border border-line bg-ink/30"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src || '/placeholder.svg'}
                  alt={photo.caption}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
                <figcaption className="p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-mute">
                      {photo.file}
                    </span>
                    {formatTakenAt(photo.takenAt) ? (
                      <span className="font-mono text-[10px] tracking-[0.04em] text-accent">
                        {formatTakenAt(photo.takenAt)}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-[13px] text-body">{photo.caption}</p>
                  {photo.locationNote ? (
                    <p className="mt-1.5 text-[12px] text-mute-2">
                      {photo.locationNote}
                    </p>
                  ) : null}
                  {photo.lat != null && photo.lon != null ? (
                    <a
                      href={osmLink(photo.lat, photo.lon)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-block rounded-sm border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-mute transition-colors hover:border-accent hover:text-accent"
                    >
                      {photo.lat.toFixed(4)}, {photo.lon.toFixed(4)} · open map ↗
                    </a>
                  ) : (
                    <div className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-mute">
                      No coordinates available
                    </div>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <PackFooter />
      </ReadingColumn>
    </>
  )
}
