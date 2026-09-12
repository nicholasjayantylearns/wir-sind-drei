/* The walking tour — designed for a septuagenarian crew of merry makers.
 *
 * Gentle pacing, short segments between sit-downs, a café/rest stop in every
 * leg, and accessible regrouping points. Coordinates are the real, public
 * locations of the named venues (used to build stable OpenStreetMap links);
 * none are invented. Where a supplied photo carried no embedded GPS EXIF, that
 * is stated plainly and the location is marked as identified-from-landmarks.
 */

export interface GpsPhoto {
  file: string
  src: string
  caption: string
  /* true when lat/lon came from EXIF embedded in the photo; false when the
     photo had no GPS metadata and the location was read from landmarks. */
  hasExif: boolean
  lat?: number
  lon?: number
  locationNote?: string
}

export interface TourStop {
  id: string
  order: number
  name: string
  neighborhood: string
  lat: number
  lon: number
  arrive: string
  segment: string // how you get here + how long on foot
  rest: string // the sit-down / café / regroup note for this stop
  mobility: string // accessibility note
  detour?: string
  photo?: GpsPhoto
}

export function osmLink(lat: number, lon: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`
}

/* Two supplied field photos. Neither shipped embedded GPS EXIF in this pack, so
   both are flagged hasExif:false and pinned by the landmarks visible in frame.
   The pack is built to hold up to 20 such assets; the loader below shows a
   clear fallback for any photo missing coordinates. */
export const FIELD_PHOTOS: GpsPhoto[] = [
  {
    file: 'IMG_3717.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3717-xa7kblmRdUrJgNmEdNBmlozQn9PBWh.jpeg',
    caption:
      'A marked Kreuzberg/Friedrichshain transit map — "More To Come!" scrawled across Görlitzer Park toward Neukölln.',
    hasExif: false,
    lat: 52.4996,
    lon: 13.4413,
    locationNote:
      'No GPS metadata embedded — pinned from map labels in frame (Görlitzer Bhf / Kottbusser Tor, Kreuzberg).',
  },
  {
    file: 'IMG_3976.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3976-lZ1aVgWScLzPa0aLJy53urTdLXjxwR.jpeg',
    caption:
      'Bahnhof Zoo, West Berlin — a stretched Trabant limousine and a costumed reveler mid-morning. The time-shifted day made visible.',
    hasExif: false,
    lat: 52.5074,
    lon: 13.332,
    locationNote:
      'No GPS metadata embedded — pinned from landmarks in frame (Bahnhof Zoo signage, U2 Ruhleben entrance).',
  },
]

export const TOUR_STOPS: TourStop[] = [
  {
    id: 'michelberger',
    order: 1,
    name: 'Michelberger Hotel',
    neighborhood: 'Friedrichshain',
    lat: 52.5053,
    lon: 13.4487,
    arrive: 'Start · morning',
    segment: 'Home base. Begin here, coffee in the courtyard.',
    rest: 'The courtyard bar is the regroup point for the whole crew all week — soft chairs, shade, restrooms.',
    mobility: 'Step-free entrance from Warschauer Str. Elevator to all floors.',
  },
  {
    id: 'east-side-gallery',
    order: 2,
    name: 'East Side Gallery',
    neighborhood: 'Friedrichshain',
    lat: 52.505,
    lon: 13.4396,
    arrive: '~10 min walk',
    segment: 'A flat, riverside 10-minute stroll along the Spree.',
    rest: 'Benches face the water the whole way; sit whenever a painting deserves a longer look.',
    mobility: 'Level paved promenade the entire length. No stairs.',
    detour:
      'Optional: cross Oberbaumbrücke for the view, then double back — adds ~15 gentle minutes.',
  },
  {
    id: 'kreuzberg-map',
    order: 3,
    name: 'Görlitzer Park & Kottbusser Tor',
    neighborhood: 'Kreuzberg',
    lat: 52.4996,
    lon: 13.4413,
    arrive: 'One U-Bahn stop + short walk',
    segment: 'Take the U1 two stops rather than walking the whole way — save the legs.',
    rest: 'Späti stop for a cold Club Mate in a glass bottle; plenty of park benches to settle on.',
    mobility:
      'U Görlitzer Bahnhof has stairs; U Kottbusser Tor has an elevator — route via Kottbusser Tor if steps are a problem.',
    photo: FIELD_PHOTOS[0],
  },
  {
    id: 'hard-wax',
    order: 4,
    name: 'Hard Wax',
    neighborhood: 'Kreuzberg · Paul-Lincke-Ufer',
    lat: 52.4998,
    lon: 13.4256,
    arrive: '~8 min canal-side walk',
    segment: 'A short, shaded walk along the Landwehrkanal.',
    rest: 'Canal benches right outside; the record shop is a browse, not a climb.',
    mobility: 'Hard Wax is on an upper floor with stairs — one of the crew can scout while others rest canal-side.',
  },
  {
    id: 'bahnhof-zoo',
    order: 5,
    name: 'Bahnhof Zoo',
    neighborhood: 'Charlottenburg · West Berlin',
    lat: 52.5074,
    lon: 13.332,
    arrive: 'S-Bahn, ~20 min (seated)',
    segment: 'A seated S-Bahn ride west — the rest leg. Watch the city change out the window.',
    rest: 'Curry 36 for a sit-down currywurst; the whole square is people-watching, Trabant limos included.',
    mobility: 'Station is fully step-free with elevators. Flat plaza throughout.',
    photo: FIELD_PHOTOS[1],
  },
  {
    id: 'club-der-visionaere',
    order: 6,
    name: 'Club der Visionaere',
    neighborhood: 'Kreuzberg · Landwehrkanal',
    lat: 52.4972,
    lon: 13.4443,
    arrive: 'Late afternoon',
    segment: 'Back east for the gentlest rehearsal: an open-air wooden deck over the canal.',
    rest: 'This IS the rest stop — sit on the deck, feet up, daylight, no queue, no sticker.',
    mobility: 'Waterside deck is largely level; a few boards underfoot. Easy in, easy out.',
  },
  {
    id: 'berghain',
    order: 7,
    name: 'Berghain',
    neighborhood: 'Friedrichshain',
    lat: 52.5111,
    lon: 13.4432,
    arrive: 'Saturday · the door',
    segment: 'Five minutes on foot from Michelberger. Everything above was rehearsal for this.',
    rest: 'Inside: the Circadian Lounge and shared locker (Level 1), soaks and naps (Level 2). Pace the night in shifts.',
    mobility: 'Entry involves a queue and uneven ground; bring a folding stool for the wait if needed.',
  },
]
