import { sValidator } from '@hono/standard-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '~server/db'
import { settingsGlobal } from '~server/db/schema'

const TUNABLE_KEY_PREFIX = 'tunable:'

const tunablesBodySchema = z.record(z.string(), z.number())

const router = new Hono()

/**
 * GET /api/tunables
 * Returns all tunable settings as a map of { [id]: value }.
 * Only rows with a numeric value are included.
 */
router.get('/', async (c) => {
  const allRows = await db.select().from(settingsGlobal)
  const tunableRows = allRows.filter((r) => r.key.startsWith(TUNABLE_KEY_PREFIX))

  const result: Record<string, number> = {}
  for (const row of tunableRows) {
    const id = row.key.slice(TUNABLE_KEY_PREFIX.length)
    const num = Number(row.value)
    if (!Number.isNaN(num)) {
      result[id] = num
    }
  }

  return c.json(result)
})

/**
 * PUT /api/tunables
 * Upserts one or more tunables. Body must be a plain object mapping tunable id → numeric value.
 */
router.put('/', sValidator('json', tunablesBodySchema), async (c) => {
  const body = c.req.valid('json')

  await Promise.all(
    Object.entries(body).map(([id, val]) => {
      const key = `${TUNABLE_KEY_PREFIX}${id}`
      return db
        .insert(settingsGlobal)
        .values({ key, value: String(val) })
        .onConflictDoUpdate({ target: settingsGlobal.key, set: { value: String(val) } })
    }),
  )

  return c.json({ ok: true })
})

export default router
