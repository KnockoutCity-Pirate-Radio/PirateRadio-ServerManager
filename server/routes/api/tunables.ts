import { sValidator } from '@hono/standard-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '~server/db'
import { statsGlobal } from '~server/db/schema'

const TUNABLE_KEY_PREFIX = 'k_backend_tunable_'

const tunablesBodySchema = z.record(z.string(), z.number())

const router = new Hono()

/**
 * GET /api/tunables
 * Returns all tunable settings as a map of { [id]: value }.
 * Only rows with a numeric value are included.
 */
router.get('/', async (c) => {
  const allRows = await db.select().from(statsGlobal)
  const tunableRows = allRows.filter((r) => r.key.startsWith(TUNABLE_KEY_PREFIX))

  const result: Record<string, number> = {}
  for (const row of tunableRows) {
    const id = row.key.slice(TUNABLE_KEY_PREFIX.length)
    result[id] = row.value
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
        .insert(statsGlobal)
        .values({ key, value: val })
        .onConflictDoUpdate({ target: statsGlobal.key, set: { value: val } })
    }),
  )

  return c.json({ ok: true })
})

export default router
