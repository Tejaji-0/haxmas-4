import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"

export const facts = sqliteTable("facts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fact: text("fact").notNull(),
  rating: integer("rating").notNull().default(0),
  createdAt: integer("created_at").notNull(),
})

