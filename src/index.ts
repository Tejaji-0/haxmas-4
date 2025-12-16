import { Hono } from "hono"
import { createFact, deleteFact, getRandomFact, listFacts, rateFact } from "./db/queries"

const app = new Hono()

app.get("/", (c) => c.text("Random Facts API!"))

app.get("/api/facts", (c) => c.json(listFacts()))

app.get("/api/facts/random", (c) => {
  const fact = getRandomFact()
  if (!fact) return c.json({ error: "no facts available" }, 404)
  return c.json(fact)
})

app.post("/api/facts", async (c) => {
  const body = await c.req.json().catch(() => null)
  const fact = (body?.fact ?? "").toString().trim()
  if (!fact) return c.json({ error: "fact is required" }, 400)

  return c.json(createFact(fact), 201)
})

app.patch("/api/facts/:id/rate", async (c) => {
  const id = Number(c.req.param("id"))
  if (!Number.isFinite(id)) return c.json({ error: "bad id" }, 400)

  const body = await c.req.json().catch(() => null)
  const rating = Number(body?.rating)
  if (!Number.isFinite(rating)) return c.json({ error: "rating must be a number" }, 400)

  const res = rateFact(id, rating)
  if (res.changes === 0) return c.json({ error: "not found" }, 404)

  return c.json({ ok: true })
})

app.delete("/api/facts/:id", (c) => {
  const id = Number(c.req.param("id"))
  if (!Number.isFinite(id)) return c.json({ error: "bad id" }, 400)

  const res = deleteFact(id)
  if (res.changes === 0) return c.json({ error: "not found" }, 404)

  return c.json({ ok: true })
})

const port = Number(process.env.PORT) || 3000

export default {
  port,
  fetch: app.fetch,
}