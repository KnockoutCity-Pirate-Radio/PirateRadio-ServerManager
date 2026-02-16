import { asc } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from '~server/db'
import { crewMembers, crews, users } from '~server/db/schema'

const router = new Hono()

/**
 * GET /api/crews
 * Returns all crews ordered by name, with members (including captain flag) and member count.
 */
router.get('/', async (c) => {
  const [crewsResult, membersResult, usersResult] = await Promise.all([
    db
      .select({
        guid: crews.guid,
        name: crews.name,
        code: crews.code,
        nameVisible: crews.nameVisible,
        createdAt: crews.createdAt,
        updatedAt: crews.updatedAt,
        captain: crews.captain,
      })
      .from(crews)
      .orderBy(asc(crews.name)),
    db
      .select({
        userId: crewMembers.userId,
        crewGuid: crewMembers.crewGuid,
        joinedAt: crewMembers.joinedAt,
      })
      .from(crewMembers),
    db.select({ id: users.id, username: users.username }).from(users),
  ])

  const usernameById = new Map(usersResult.map((u) => [String(u.id), u.username]))

  const membersByCrewGuid = new Map<
    string,
    Array<{ id: string; username: string; joinedAt: number; isCaptain: boolean }>
  >()
  for (const m of membersResult) {
    const key = m.crewGuid
    if (!membersByCrewGuid.has(key)) membersByCrewGuid.set(key, [])
    membersByCrewGuid.get(key)!.push({
      id: String(m.userId),
      username: usernameById.get(String(m.userId)) ?? String(m.userId),
      joinedAt: m.joinedAt,
      isCaptain: false, // filled below
    })
  }

  const result = crewsResult.map((crew) => {
    const members = (membersByCrewGuid.get(crew.guid) ?? []).map((m) => ({
      ...m,
      isCaptain: m.id === String(crew.captain),
    }))

    return {
      guid: crew.guid,
      name: crew.name,
      code: crew.code,
      nameVisible: crew.nameVisible,
      createdAt: crew.createdAt,
      updatedAt: crew.updatedAt,
      captain: {
        id: String(crew.captain),
        username: usernameById.get(String(crew.captain)) ?? String(crew.captain),
      },
      members,
      memberCount: members.length,
    }
  })

  return c.json(result)
})

export default router
