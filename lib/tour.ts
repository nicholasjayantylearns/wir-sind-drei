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
  /* true when lat/lon came from EXIF embedded in the photo (as extracted into
     the pack's GPS-coordinates index); false when the photo carried no GPS
     metadata and there is no coordinate row for it. */
  hasExif: boolean
  lat?: number
  lon?: number
  /* raw EXIF capture stamp, "YYYY:MM:DD HH:MM:SS", preserved as provenance. */
  takenAt?: string
  locationNote?: string
}

/* Format a raw EXIF "2014:05:15 14:06:16" stamp as "2014-05-15 · 14:06". */
export function formatTakenAt(raw?: string): string | null {
  if (!raw) return null
  const m = raw.match(/^(\d{4}):(\d{2}):(\d{2})\s+(\d{2}):(\d{2})/)
  if (!m) return null
  const [, y, mo, d, h, mi] = m
  return `${y}-${mo}-${d} · ${h}:${mi}`
}

/* Look a field photo up by filename so tour stops reference by stable key
   rather than array index. */
export function getPhoto(file: string): GpsPhoto | undefined {
  return FIELD_PHOTOS.find((p) => p.file === file)
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

/* Field photos from the Berlin context pack. Coordinates and capture stamps are
   the real EXIF values extracted into the pack's GPS-coordinates index — none
   are invented. Every photo with a coordinate row is flagged hasExif:true and
   pinned to its embedded position; the one photo with no row (IMG_0586) is
   flagged hasExif:false and shown with a clear no-coordinates fallback. */
export const FIELD_PHOTOS: GpsPhoto[] = [
  {
    file: 'IMG_1417.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_1417-3J2AqeN6NjI08lgcY5puciJlFPvzU5.jpeg',
    caption:
      'A pop-up theater ticket kiosk (Theaterkasse) under a striped awning, a potted date palm dead center and the Fernsehturm just past the trees.',
    hasExif: true,
    lat: 52.522167,
    lon: 13.393622,
    takenAt: '2014:05:15 14:06:16',
    locationNote: 'Neighborhood read from the EXIF coordinate: Mitte.',
  },
  {
    file: 'IMG_1595.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_1595-xlnuvDTKFwSMBaX0wiv2pYhNBFRcdW.jpeg',
    caption:
      'A jointed wooden prosthetic hand on a museum plinth — a fitting emblem for a crew rebuilding its rhythm limb by limb.',
    hasExif: true,
    lat: 52.517942,
    lon: 13.397844,
    takenAt: '2014:05:18 17:34:55',
    locationNote: 'Neighborhood read from the EXIF coordinate: Mitte.',
  },
  {
    file: 'IMG_0695.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0695-uVpTpuNXM6jpa0cZdqhRYdaqDtsbuG.jpeg',
    caption:
      'Looking straight up the red-brick neo-Gothic tower of a Prenzlauer Berg church, saints set into the buttresses.',
    hasExif: true,
    lat: 52.533417,
    lon: 13.4215,
    takenAt: '2014:05:08 14:01:41',
    locationNote: 'Neighborhood read from the EXIF coordinate: Prenzlauer Berg.',
  },
  {
    file: 'IMG_0869.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0869-859VtIhJKi7vVI87Lu7TiFiEL48u8p.jpeg',
    caption:
      'A traveler leaning, tongue out, into a giant pink lowercase "n" sculpture outside a Kreuzberg storefront.',
    hasExif: true,
    lat: 52.501372,
    lon: 13.451083,
    takenAt: '2014:05:08 16:44:19',
    locationNote: 'Neighborhood read from the EXIF coordinate: Kreuzberg.',
  },
  {
    file: 'IMG_3038.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3038-WmoA9DPv3EYIsOXVrNKD2By1gw2cNk.jpeg',
    caption:
      'A traveler in Porsche aviators against a wall of hand-painted concentric circles near the Landwehrkanal.',
    hasExif: true,
    lat: 52.497836,
    lon: 13.436664,
    takenAt: '2014:06:26 13:11:10',
    locationNote:
      'Neighborhood read from the EXIF coordinate: Kreuzberg / Neukölln canal.',
  },
  {
    file: 'IMG_3717.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3717-xa7kblmRdUrJgNmEdNBmlozQn9PBWh.jpeg',
    caption:
      'A West Berlin street scene near Bahnhof Zoo — Curry 36 and Alt Berlin, the late-morning city on its own clock.',
    hasExif: true,
    lat: 52.505161,
    lon: 13.337256,
    takenAt: '2014:07:14 11:27:13',
    locationNote: 'Neighborhood read from the EXIF coordinate: Charlottenburg / Zoo.',
  },
  {
    file: 'IMG_3684.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3684-d6KeQyItCTtFUq2vgrhcpbZeQzmBkZ.jpeg',
    caption:
      'A World Cup street selfie in black-red-gold face paint outside a Deutsche Bank in West Berlin — the summer the tournament ran on shifted hours.',
    hasExif: true,
    lat: 52.506333,
    lon: 13.332711,
    takenAt: '2014:07:13 20:30:39',
    locationNote: 'Neighborhood read from the EXIF coordinate: Charlottenburg / Zoo.',
  },
  {
    file: 'IMG_3976.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3976-lZ1aVgWScLzPa0aLJy53urTdLXjxwR.jpeg',
    caption:
      'A time-shifted West Berlin street near Bahnhof Zoo — a costumed reveler mid-afternoon, the day made visible.',
    hasExif: true,
    lat: 52.506339,
    lon: 13.332828,
    takenAt: '2014:07:19 16:27:06',
    locationNote: 'Neighborhood read from the EXIF coordinate: Charlottenburg / Zoo.',
  },
  {
    file: 'IMG_3736.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3736-0K15tMVd6K39KRG2rEXozGHb36cmY1.jpeg',
    caption:
      'Sunset behind the Fernsehturm from a Friedrichshain rail bridge, the S-Bahn tracks catching the last light.',
    hasExif: true,
    lat: 52.50575,
    lon: 13.449939,
    takenAt: '2014:07:16 20:35:59',
    locationNote: 'Neighborhood read from the EXIF coordinate: Friedrichshain.',
  },
  {
    file: 'IMG_0586.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0586-kbV73AQs4LSsRKWBPgg7EuOvuwUK6j.jpeg',
    caption:
      'A painted figure holding up a hand over a red no-symbol on the East Side Gallery, tourists walking the wall.',
    hasExif: false,
    locationNote:
      'The one photo in the pack with no coordinate row — no embedded GPS to plot. Shown here without a pin rather than guessing.',
  },
  {
    file: 'IMG_3728.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3728-J17fzUVttQ80YFg0xeoVsm7t5sKxnF.jpeg',
    caption:
      'Three street performers — a singer with rainbow-dyed hair and two men — mid-song against a brick wall at golden hour, an evening crowd watching.',
    hasExif: true,
    lat: 52.505131,
    lon: 13.448839,
    takenAt: '2014:07:16 20:33:56',
    locationNote: 'Neighborhood read from the EXIF coordinate: Friedrichshain.',
  },
  {
    file: 'IMG_3732.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3732-xcI66MPVPkCYHyG4iLFWgsJXq8wRoq.jpeg',
    caption:
      'A rapper in a white tank top, arm flung wide into the low sun, working a street crowd outside a brick hall.',
    hasExif: true,
    lat: 52.505314,
    lon: 13.449211,
    takenAt: '2014:07:16 20:34:13',
    locationNote: 'Neighborhood read from the EXIF coordinate: Friedrichshain.',
  },
  {
    file: 'IMG_3771.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3771-kYsANseaOv6cgcADagK96J3lHCNtTL.jpeg',
    caption:
      'The city from a moving train window — a graffiti-tagged rail yard, a brick factory chimney, apartment blocks beyond.',
    hasExif: true,
    lat: 52.504269,
    lon: 13.462294,
    takenAt: '2014:07:16 20:40:50',
    locationNote: 'Neighborhood read from the EXIF coordinate: Friedrichshain.',
  },
  {
    file: 'IMG_3799.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3799-zPhtTglDc8tqMbrezGO2ozW4yXEiwq.jpeg',
    caption:
      'A wooden fence painted in block capitals: "WE ARE AN IMAGE FROM THE FUTURE" — the pack\'s thesis, found on a wall.',
    hasExif: true,
    lat: 52.501744,
    lon: 13.466528,
    takenAt: '2014:07:16 20:46:05',
    locationNote: 'Neighborhood read from the EXIF coordinate: Friedrichshain.',
  },
  {
    file: 'IMG_3800.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3800-sAiNOVvpL5bDJyk3g1NYFGb2xo3HW2.jpeg',
    caption:
      'Black-and-white stencil street art on a plank fence — a man in a beret and shades leaning in to a figure.',
    hasExif: true,
    lat: 52.501744,
    lon: 13.466528,
    takenAt: '2014:07:16 20:46:07',
    locationNote: 'Neighborhood read from the EXIF coordinate: Friedrichshain.',
  },
  {
    file: 'IMG_3814.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3814-ytr3H5zybFYIOe4S8o4cTQF96hIIMB.jpeg',
    caption:
      'A long corrugated-metal wall running a footpath, layered in blue and black tags with a red-and-yellow "HA" piece.',
    hasExif: true,
    lat: 52.5023,
    lon: 13.4654,
    takenAt: '2014:07:16 20:47:38',
    locationNote: 'Neighborhood read from the EXIF coordinate: Friedrichshain.',
  },
  {
    file: 'IMG_4045.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_4045-yezJbr3RWhf9TZ6otEbaQiUKL7lTTa.jpeg',
    caption:
      'A gray-haired man filming a projected video piece on his phone in a raw concrete space tagged "HOX" in red.',
    hasExif: true,
    lat: 52.505111,
    lon: 13.337472,
    takenAt: '2014:07:24 17:18:42',
    locationNote: 'Neighborhood read from the EXIF coordinate: Charlottenburg / Zoo.',
  },
  {
    file: 'IMG_4047.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_4047-yFXwiqwCy5PZ75JNP0MCStA2R8ObJA.jpeg',
    caption:
      'A handwritten note taped to a door: "IN BERLIN MUSIC IS THE DRUG & WE\'RE ITS PUSHER" — a 2:42am field find.',
    hasExif: true,
    lat: 52.499067,
    lon: 13.312542,
    takenAt: '2014:07:25 02:42:59',
    locationNote: 'Neighborhood read from the EXIF coordinate: West Berlin.',
  },
  {
    file: 'IMG_4058.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_4058-orFu28OzY9JGszm00Gdl3UyxRLFSVS.jpeg',
    caption:
      'A warm-lit 3:53am selfie of a bald, bearded traveler, the dark Berghain-side lots and lights behind him.',
    hasExif: true,
    lat: 52.510833,
    lon: 13.442742,
    takenAt: '2014:07:26 03:53:25',
    locationNote: 'Neighborhood read from the EXIF coordinate: Friedrichshain.',
  },
  {
    file: 'IMG_4061.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_4061-SNYHgxXZe7WqKV28s3XUkGzvw0CN5Q.jpeg',
    caption:
      'A dawn group photo of four friends against the fence, the monumental Berghain block rising behind them.',
    hasExif: true,
    lat: 52.511014,
    lon: 13.442372,
    takenAt: '2014:07:26 05:02:13',
    locationNote: 'Neighborhood read from the EXIF coordinate: Friedrichshain.',
  },
  {
    file: 'IMG_4062.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_4062-oFJ8nWkwUOlVbteqMxg7gsOri8DwkP.jpeg',
    caption:
      'A tighter 5am selfie of the same crew at the Berghain fence, all grins after the night — recharge, regroup, recoup.',
    hasExif: true,
    lat: 52.511003,
    lon: 13.441853,
    takenAt: '2014:07:26 05:02:27',
    locationNote: 'Neighborhood read from the EXIF coordinate: Friedrichshain.',
  },
  {
    file: 'IMG_4076.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_4076-AvT4Qc9k9M3hp9dhvkczY75I8UJD9x.jpeg',
    caption:
      'A dark installation room — a huge white wall studded with green-rimmed holes, a lone figure silhouetted, magenta panels beyond.',
    hasExif: true,
    lat: 52.506753,
    lon: 13.368247,
    takenAt: '2014:07:27 00:04:53',
    locationNote: 'Neighborhood read from the EXIF coordinate: Tiergarten.',
  },
  {
    file: 'IMG_4104.jpeg',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_4104-GeTDxxyo4jkjV9d9r4yvlV0R3hyj4i.jpeg',
    caption:
      'A giant white sphere painted with blue teardrops floating over a green-lit crowd, projections washing the walls.',
    hasExif: true,
    lat: 52.506722,
    lon: 13.368439,
    takenAt: '2014:07:27 00:16:38',
    locationNote: 'Neighborhood read from the EXIF coordinate: Tiergarten.',
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
    photo: getPhoto('IMG_0869.jpeg'),
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
    photo: getPhoto('IMG_3976.jpeg'),
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
