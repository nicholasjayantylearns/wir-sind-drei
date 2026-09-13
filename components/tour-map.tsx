"use client"

import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMapEvents } from "react-leaflet"
import type { PointOfInterest } from "@/lib/db/schema"
import { COORD_ONLY_POINTS, PHOTO_POINTS, formatStamp, hourOf } from "@/lib/tour-coordinates"
import { colorForHour } from "@/lib/entrainment-color"

const BERLIN_CENTER: [number, number] = [52.5125, 13.408]

function poiImageSrc(imageUrl: string): string {
  return imageUrl.startsWith("http") ? imageUrl : `/api/file?pathname=${encodeURIComponent(imageUrl)}`
}

/* Small pulsing pin used for the location the visitor is about to submit. */
const pickIcon = L.divIcon({
  className: "",
  html: `<div class="tourmap-pick"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

function ClickToPick({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export interface TourMapProps {
  pois: PointOfInterest[]
  pickMode: boolean
  picked: { lat: number; lng: number } | null
  onPick: (lat: number, lng: number) => void
}

export default function TourMap({ pois, pickMode, picked, onPick }: TourMapProps) {
  return (
    <MapContainer
      center={BERLIN_CENTER}
      zoom={13}
      scrollWheelZoom
      className="h-full w-full"
      style={{ background: "#0b0b0d", cursor: pickMode ? "crosshair" : "grab" }}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
        maxZoom={16}
      />
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
        maxZoom={16}
      />

      {pickMode && <ClickToPick onPick={onPick} />}

      {/* Coordinate-only pins — real position + capture time, no image */}
      {COORD_ONLY_POINTS.map((p) => {
        const { hex } = colorForHour(hourOf(p.takenAt))
        return (
          <CircleMarker
            key={p.file}
            center={[p.lat, p.lng]}
            radius={4}
            pathOptions={{ color: hex, weight: 1.5, fillColor: hex, fillOpacity: 0.12 }}
          >
            <Popup>
              <div className="tourmap-popup">
                <p className="tourmap-popup-file">{p.file}</p>
                <p className="tourmap-popup-time">{formatStamp(p.takenAt)}</p>
                <p className="tourmap-popup-note">Located from EXIF — no image in the pack.</p>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}

      {/* Photo pins — filled, with the actual picture */}
      {PHOTO_POINTS.map((p) => {
        const { hex } = colorForHour(hourOf(p.takenAt))
        return (
          <CircleMarker
            key={p.file}
            center={[p.lat, p.lng]}
            radius={7}
            pathOptions={{ color: hex, weight: 2, fillColor: hex, fillOpacity: 0.85 }}
          >
            <Popup>
              <div className="tourmap-popup">
                {p.src && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.src || "/placeholder.svg"} alt={p.caption ?? p.file} className="tourmap-popup-img" />
                )}
                <p className="tourmap-popup-time">{formatStamp(p.takenAt)}</p>
                {p.caption && <p className="tourmap-popup-caption">{p.caption}</p>}
              </div>
            </Popup>
          </CircleMarker>
        )
      })}

      {/* Visitor-submitted points of interest */}
      {pois.map((poi) => (
        <CircleMarker
          key={`poi-${poi.id}`}
          center={[poi.lat, poi.lng]}
          radius={8}
          pathOptions={{
            color: "var(--tourmap-accent)",
            weight: 2,
            fillColor: "var(--tourmap-accent)",
            fillOpacity: 0.9,
            className: "tourmap-poi-marker",
          }}
        >
          <Popup>
            <div className="tourmap-popup">
              {(() => {
                const photos = poi.imageUrls?.length ? poi.imageUrls : poi.imageUrl ? [poi.imageUrl] : []
                if (!photos.length) return null
                return (
                  <div className={`tourmap-popup-gallery${photos.length === 1 ? " single" : ""}`}>
                    {photos.map((p, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={p} src={poiImageSrc(p) || "/placeholder.svg"} alt={`${poi.name} — photo ${i + 1}`} />
                    ))}
                  </div>
                )
              })()}
              <p className="tourmap-popup-caption">{poi.name}</p>
              {poi.note && <p className="tourmap-popup-note">{poi.note}</p>}
              <p className="tourmap-popup-badge">Added by a visitor</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {picked && <Marker position={[picked.lat, picked.lng]} icon={pickIcon} />}
    </MapContainer>
  )
}
