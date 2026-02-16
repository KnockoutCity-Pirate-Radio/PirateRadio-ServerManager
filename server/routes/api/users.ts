import { sValidator } from '@hono/standard-validator'
import { asc, eq, ilike, max } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '~server/db'
import {
  allowlistedUsers,
  commerceFunds,
  crewMembers,
  crews,
  matchmaking,
  matchmakingCooldown,
  skill,
  streetRank,
  users,
} from '~server/db/schema'

const searchQuerySchema = z.object({ q: z.string().min(1) })
const cooldownParamSchema = z.object({ id: z.coerce.number().int().positive() })

const router = new Hono()

/**
 * GET /api/users
 * Returns all users with aggregated profile data: XP, MMR, cooldown, funds, crew, allowlist flags, and matchmaking state.
 */
router.get('/', async (c) => {
  const [
    usersResult,
    streetRankResult,
    skillResult,
    cooldownResult,
    fundsResult,
    crewResult,
    allowlistResult,
    matchmakingResult,
  ] = await Promise.all([
    db
      .select({
        id: users.id,
        username: users.username,
        publisherUsername: users.publisherUsername,
        insertedAt: users.insertedAt,
        lastAuthenticatedAt: users.lastAuthenticatedAt,
        usernameVisible: users.usernameVisible,
      })
      .from(users)
      .orderBy(asc(users.username)),
    db.select({ userId: streetRank.userId, rawXpS6: streetRank.rawXpS6 }).from(streetRank),
    db
      .select({ userId: skill.userId, mmr: max(skill.currentMmr) })
      .from(skill)
      .groupBy(skill.userId),
    db
      .select({ userId: matchmakingCooldown.userId, utc: matchmakingCooldown.utc })
      .from(matchmakingCooldown),
    db
      .select({
        userId: commerceFunds.userId,
        currency: commerceFunds.currency,
        balance: commerceFunds.balance,
      })
      .from(commerceFunds),
    db
      .select({
        userId: crewMembers.userId,
        crewGuid: crewMembers.crewGuid,
        crewName: crews.name,
        crewCode: crews.code,
        captain: crews.captain,
      })
      .from(crewMembers)
      .leftJoin(crews, eq(crewMembers.crewGuid, crews.guid)),
    db
      .select({
        userId: allowlistedUsers.userId,
        alwaysAllowLogin: allowlistedUsers.alwaysAllowLogin,
        forceCohortA: allowlistedUsers.forceCohortA,
        forceCohortB: allowlistedUsers.forceCohortB,
        contentUpdate: allowlistedUsers.contentUpdate,
      })
      .from(allowlistedUsers),
    db
      .select({
        userId: matchmaking.userId,
        startTime: matchmaking.startTime,
        matchFlow: matchmaking.matchFlow,
        platform: matchmaking.platform,
        playlistGuid: matchmaking.playlistGuid,
      })
      .from(matchmaking),
  ])

  const xpByUserId = new Map(streetRankResult.map((r) => [String(r.userId), r.rawXpS6]))
  const mmrByUserId = new Map(skillResult.map((r) => [String(r.userId), r.mmr]))
  const cooldownByUserId = new Map(cooldownResult.map((r) => [String(r.userId), r.utc]))
  const allowlistByUserId = new Map(allowlistResult.map((r) => [String(r.userId), r]))
  const matchmakingByUserId = new Map(matchmakingResult.map((r) => [String(r.userId), r]))

  const fundsByUserId = new Map<string, Array<{ currency: string; balance: number }>>()
  for (const r of fundsResult) {
    const key = String(r.userId)
    if (!fundsByUserId.has(key)) fundsByUserId.set(key, [])
    fundsByUserId.get(key)!.push({ currency: r.currency, balance: r.balance })
  }

  const crewByUserId = new Map<string, { guid: string; name: string; code: number; isCaptain: boolean }>()
  for (const r of crewResult) {
    if (r.crewGuid && r.crewName && r.crewCode !== null) {
      crewByUserId.set(String(r.userId), {
        guid: r.crewGuid,
        name: r.crewName,
        code: r.crewCode,
        isCaptain: String(r.captain) === String(r.userId),
      })
    }
  }

  const result = usersResult.map((user) => {
    const mm = matchmakingByUserId.get(user.id)
    const al = allowlistByUserId.get(user.id)
    return {
      ...user,
      rawXpS6: xpByUserId.get(user.id) ?? null,
      mmr: mmrByUserId.get(user.id) ?? null,
      penaltyUtc: cooldownByUserId.get(user.id) ?? null,
      funds: fundsByUserId.get(user.id) ?? [],
      crew: crewByUserId.get(user.id) ?? null,
      allowlisted: al
        ? {
            alwaysAllowLogin: al.alwaysAllowLogin,
            forceCohortA: al.forceCohortA,
            forceCohortB: al.forceCohortB,
            contentUpdate: al.contentUpdate,
          }
        : null,
      matchmaking: mm
        ? {
            startTime: mm.startTime,
            matchFlow: mm.matchFlow,
            platform: mm.platform,
            playlistGuid: mm.playlistGuid,
          }
        : null,
    }
  })

  return c.json(result)
})

/**
 * GET /api/users/search?q=
 * Returns up to 25 users whose username contains the query string (case-insensitive).
 */
router.get('/search', sValidator('query', searchQuerySchema), async (c) => {
  const { q } = c.req.valid('query')

  const results = await db
    .select({ id: users.id, username: users.username })
    .from(users)
    .where(ilike(users.username, `%${q}%`))
    .orderBy(asc(users.username))
    .limit(25)

  return c.json(results)
})

/**
 * DELETE /api/users/:id/cooldown
 * Removes the matchmaking cooldown/penalty for the given user.
 */
router.delete('/:id/cooldown', sValidator('param', cooldownParamSchema), async (c) => {
  const { id } = c.req.valid('param')
  await db.delete(matchmakingCooldown).where(eq(matchmakingCooldown.userId, id))
  return c.newResponse(null, 204)
})

export default router
