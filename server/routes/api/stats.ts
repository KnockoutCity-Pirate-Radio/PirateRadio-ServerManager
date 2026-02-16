import { count, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from '~server/db'
import { pingData, users } from '~server/db/schema'

const router = new Hono()

/**
 * GET /api/stats
 * Returns currently connected players with ping info plus aggregate stats
 * (lowest/highest/average ping and total registered user count).
 */
router.get('/', async (c) => {
  const [connectedPlayers, [totalUsers]] = await Promise.all([
    db
      .select({
        userId: pingData.userId,
        username: users.username,
        ping: pingData.ping,
        region: pingData.region,
      })
      .from(pingData)
      .innerJoin(users, eq(pingData.userId, users.id)),

    db.select({ count: count() }).from(users),
  ])

  const sorted = [...connectedPlayers].sort((a, b) => a.ping - b.ping)
  const lowestPing = sorted[0] ?? null
  const highestPing = sorted[sorted.length - 1] ?? null
  const averagePing =
    connectedPlayers.length > 0
      ? Math.round(connectedPlayers.reduce((sum, p) => sum + p.ping, 0) / connectedPlayers.length)
      : 0

  return c.json({
    connectedPlayers,
    lowestPing,
    highestPing,
    averagePing,
    totalUserCount: Number(totalUsers.count),
  })
})

export default router
