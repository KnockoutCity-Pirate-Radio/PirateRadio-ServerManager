import { sValidator } from '@hono/standard-validator'
import { eq, max } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '~server/db'
import { allowlistedUsers, denyLoginPeriodMessages, denyLoginPeriods, users } from '~server/db/schema'

export type DenyPeriodMessage = {
  id: number
  languageCode: string
  message: string
}

export type DenyPeriod = {
  id: number
  startTime: number
  endTime: number
  messages: DenyPeriodMessage[]
}

const periodParamSchema = z.object({ id: z.coerce.number().int().positive() })

const createPeriodSchema = z.object({
  startTime: z.number().int(),
  endTime: z.number().int(),
  messages: z.array(
    z.object({
      languageCode: z.string().min(1),
      message: z.string().min(1),
    }),
  ),
})

const allowlistBodySchema = z.object({ userId: z.number().int().positive() })
const allowlistParamSchema = z.object({ userId: z.coerce.number().int().positive() })

const router = new Hono()

/**
 * GET /api/maintenance
 * Returns all deny-login periods with their localised messages.
 */
router.get('/', async (c) => {
  const [periods, messages] = await Promise.all([
    db.select().from(denyLoginPeriods),
    db.select().from(denyLoginPeriodMessages),
  ])

  const result: DenyPeriod[] = periods.map((p) => ({
    id: p.id,
    startTime: p.startTime,
    endTime: p.endTime,
    messages: messages
      .filter((m) => m.denyLoginPeriodId === p.id)
      .map((m) => ({ id: m.id, languageCode: m.languageCode, message: m.message })),
  }))

  return c.json(result)
})

/**
 * POST /api/maintenance
 * Creates a new deny-login period with localised messages.
 * Returns the generated period id.
 */
router.post('/', sValidator('json', createPeriodSchema), async (c) => {
  const body = c.req.valid('json')

  const [[maxPeriod], [maxMsg]] = await Promise.all([
    db.select({ maxId: max(denyLoginPeriods.id) }).from(denyLoginPeriods),
    db.select({ maxId: max(denyLoginPeriodMessages.id) }).from(denyLoginPeriodMessages),
  ])

  const nextPeriodId = (maxPeriod?.maxId ?? 0) + 1
  let nextMsgId = (maxMsg?.maxId ?? 0) + 1

  await db.transaction(async (tx) => {
    await tx.insert(denyLoginPeriods).values({
      id: nextPeriodId,
      startTime: body.startTime,
      endTime: body.endTime,
    })

    await Promise.all(
      body.messages.map((msg) =>
        tx.insert(denyLoginPeriodMessages).values({
          id: nextMsgId++,
          denyLoginPeriodId: nextPeriodId,
          languageCode: msg.languageCode,
          message: msg.message,
        }),
      ),
    )
  })

  return c.json({ id: nextPeriodId }, 201)
})

/**
 * DELETE /api/maintenance/:id
 * Deletes a deny-login period and all associated messages.
 */
router.delete('/:id', sValidator('param', periodParamSchema), async (c) => {
  const { id } = c.req.valid('param')

  await db.transaction(async (tx) => {
    await tx.delete(denyLoginPeriodMessages).where(eq(denyLoginPeriodMessages.denyLoginPeriodId, id))
    await tx.delete(denyLoginPeriods).where(eq(denyLoginPeriods.id, id))
  })

  return c.newResponse(null, 204)
})

// ---------------------------------------------------------------------------
// Maintenance allowlist
// ---------------------------------------------------------------------------

/**
 * GET /api/maintenance/allowlist
 * Returns all users that are always allowed to log in during maintenance.
 */
router.get('/allowlist', async (c) => {
  const [allowlisted, allUsers] = await Promise.all([
    db.select().from(allowlistedUsers).where(eq(allowlistedUsers.alwaysAllowLogin, true)),
    db.select({ id: users.id, username: users.username }).from(users),
  ])

  const usernameById = new Map(allUsers.map((u) => [u.id, u.username]))

  const result = allowlisted.map((a) => ({
    userId: a.userId,
    username: usernameById.get(String(a.userId)) ?? null,
  }))

  return c.json(result)
})

/**
 * POST /api/maintenance/allowlist
 * Adds a user to the maintenance allowlist (upsert).
 */
router.post('/allowlist', sValidator('json', allowlistBodySchema), async (c) => {
  const { userId } = c.req.valid('json')

  await db
    .insert(allowlistedUsers)
    .values({
      userId,
      alwaysAllowLogin: true,
      velanValueTransfer: false,
      forceCohortA: false,
      forceCohortB: false,
      contentUpdate: false,
      createdAt: Math.floor(Date.now() / 1000),
    })
    .onConflictDoUpdate({
      target: allowlistedUsers.userId,
      set: { alwaysAllowLogin: true },
    })

  return c.newResponse(null, 204)
})

/**
 * DELETE /api/maintenance/allowlist/:userId
 * Removes a user from the maintenance allowlist by setting alwaysAllowLogin to false.
 */
router.delete('/allowlist/:userId', sValidator('param', allowlistParamSchema), async (c) => {
  const { userId } = c.req.valid('param')

  await db
    .update(allowlistedUsers)
    .set({ alwaysAllowLogin: false })
    .where(eq(allowlistedUsers.userId, userId))

  return c.newResponse(null, 204)
})

export default router
