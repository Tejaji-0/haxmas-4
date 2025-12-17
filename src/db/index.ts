import "dotenv/config"
import { Database } from "bun:sqlite"
import { drizzle } from "drizzle-orm/bun-sqlite"
import { facts } from "./schema"

const sqlite = new Database(process.env.DB_FILE_NAME!)
export const db = drizzle(sqlite)

// Create table if it doesn't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS facts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fact TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  )
`)