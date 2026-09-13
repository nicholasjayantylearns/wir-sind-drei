import { pgTable, serial, text, doublePrecision, integer, timestamp } from "drizzle-orm/pg-core"

/* Visitor-submitted points of interest for the community tour map.
   Public/community data — intentionally not scoped to a user account. */
export const pointsOfInterest = pgTable("points_of_interest", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  note: text("note"),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  imageUrl: text("image_url"),
  imageUrls: text("image_urls").array(),
  /* Local capture hour (0–23) of the cover photo, read from EXIF before
     client-side compression strips it. Drives the pin's entrainment color. */
  takenHour: integer("taken_hour"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type PointOfInterest = typeof pointsOfInterest.$inferSelect
