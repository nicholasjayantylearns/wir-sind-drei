import type { Metadata } from "next"
import { EntrainmentBackground } from "@/components/entrainment-background"
import { LeftRail } from "@/components/left-rail"
import { ModuleHeading, PackFooter } from "@/components/pack-chrome"
import { MapExperience } from "@/components/map-experience"
import { listPois } from "@/app/actions/poi"
import { COORD_ONLY_POINTS, LOCATED_POINTS, PHOTO_POINTS } from "@/lib/tour-coordinates"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "The Field Map — Wir Sind Drei",
  description:
    "Every located Berlin field photo plotted on an interactive map from its own EXIF coordinates, colored by the time of day it was shot — and open for visitors to add their own points of interest.",
}

export default async function MapPage() {
  const pois = await listPois()

  return (
    <>
      <EntrainmentBackground />
      <LeftRail current="/map" />
      <main className="relative z-0 mx-auto box-border max-w-[1100px] px-5 py-14 md:px-8 md:pl-32 md:ml-16">
        <section className="mb-6">
          <ModuleHeading eyebrow="Field Map · The Located Field">
            {`${LOCATED_POINTS.length} moments, plotted where they happened.`}
          </ModuleHeading>
          <p className="max-w-[62ch] text-[15px] leading-relaxed text-body">
            Every located photo from the Berlin pack, dropped on the map at the exact latitude and longitude read from its
            own EXIF metadata and tinted by the hour it was shot — warm gold at dawn, cooling to steel by midday, coral by
            dusk. {PHOTO_POINTS.length} carry a picture you can open; the other {COORD_ONLY_POINTS.length} are
            coordinate-only pins — a real place and time, no image in the pack. Add your own spots with{" "}
            <span className="text-paper">Add point of interest</span>.
          </p>
        </section>

        <section className="mb-9">
          <MapExperience initialPois={pois} />
        </section>

        <PackFooter />
      </main>
    </>
  )
}
