import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

// The Neon integration provisions several connection strings. Prefer the pooled
// endpoint (POSTGRES_URL) and fall back through the other Neon-provided vars.
// DATABASE_URL is last because it can be overridden with a non-connection value.
const connectionString =
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_URL

export const pool = new Pool({ connectionString })
export const db = drizzle(pool, { schema })
