import { db } from "./index"
import { facts } from "./schema"
import { eq, desc, sql } from "drizzle-orm"

export function listFacts() {
  return db.select().from(facts).orderBy(desc(facts.id)).all()
}

export function getRandomFact() {
  const result = db.select().from(facts).orderBy(sql`RANDOM()`).limit(1).all()
  return result[0] || null
}

export function createFact(fact: string) {
  const createdAt = Math.floor(Date.now() / 1000)

  const res = db.insert(facts).values({
    fact,
    rating: 0,
    createdAt,
  }).run()

  return { id: Number(res.lastInsertRowid) }
}

export function rateFact(id: number, rating: number) {
  const res = db.update(facts)
    .set({ rating })
    .where(eq(facts.id, id))
    .run()

  return { changes: res.changes }
}

export function deleteFact(id: number) {
  const res = db.delete(facts).where(eq(facts.id, id)).run()
  return { changes: res.changes }
}