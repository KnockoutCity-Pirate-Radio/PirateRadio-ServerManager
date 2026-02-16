import { sValidator } from '@hono/standard-validator'
import { eq } from 'drizzle-orm'
import type { PgTransaction } from 'drizzle-orm/pg-core'
import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '~server/db'
import { news, newsItems, newsItemText } from '~server/db/schema'

/** Sentinel value used when a news entry has no end date. */
const NEWS_NO_END_DATE = 2147483647

const textSchema = z.object({
  language: z.string().nullable(),
  title: z.string().nullable(),
  message: z.string().nullable(),
})

const itemSchema = z.object({
  priority: z.number().int(),
  slot0: z.boolean(),
  slot1: z.boolean(),
  slot2: z.boolean(),
  platforms: z.string().nullable(),
  imageIndex: z.number().int(),
  texts: z.array(textSchema),
})

const newsBodySchema = z.object({
  startAt: z.number().int(),
  endAt: z.number().int(),
  items: z.array(itemSchema),
})

const newsParamSchema = z.object({ name: z.string().uuid() })

type NewsBody = z.infer<typeof newsBodySchema>

/** Inserts all items and their localised texts for a news entry within an existing transaction. */
// biome-ignore lint/suspicious/noExplicitAny: drizzle transaction type is opaque
async function writeNewsItems(tx: PgTransaction<any, any, any>, newsName: string, items: NewsBody['items']) {
  for (const item of items) {
    const itemName = crypto.randomUUID()
    await tx.insert(newsItems).values({
      newsName,
      name: itemName,
      priority: item.priority,
      slot0: item.slot0,
      slot1: item.slot1,
      slot2: item.slot2,
      platforms: item.platforms,
      imageIndex: item.imageIndex,
    })
    await Promise.all(
      item.texts.map((text) =>
        tx.insert(newsItemText).values({
          newsName,
          itemName,
          language: text.language,
          title: text.title,
          message: text.message,
        }),
      ),
    )
  }
}

const router = new Hono()

/**
 * GET /api/news
 * Returns all news entries with their items and localised text.
 */
router.get('/', async (c) => {
  const [allNews, allItems, allTexts] = await Promise.all([
    db.select().from(news),
    db.select().from(newsItems),
    db.select().from(newsItemText),
  ])

  const result = allNews.map((n) => ({
    name: n.name,
    startAt: n.startAt,
    endAt: n.endAt === null || n.endAt === -1 ? NEWS_NO_END_DATE : n.endAt,
    items: allItems
      .filter((i) => i.newsName === n.name)
      .map((i) => ({
        name: i.name,
        priority: i.priority,
        slot0: i.slot0,
        slot1: i.slot1,
        slot2: i.slot2,
        platforms: i.platforms,
        imageIndex: i.imageIndex,
        texts: allTexts
          .filter((t) => t.newsName === n.name && t.itemName === i.name)
          .map((t) => ({ language: t.language, title: t.title, message: t.message })),
      })),
  }))

  return c.json(result)
})

/**
 * POST /api/news
 * Creates a new news entry with items and localised text.
 * Returns the generated entry name.
 */
router.post('/', sValidator('json', newsBodySchema), async (c) => {
  const body = c.req.valid('json')
  const newsName = crypto.randomUUID()

  await db.transaction(async (tx) => {
    await tx.insert(news).values({ name: newsName, startAt: body.startAt, endAt: body.endAt })
    await writeNewsItems(tx, newsName, body.items)
  })

  return c.json({ name: newsName }, 201)
})

/**
 * PUT /api/news/:name
 * Replaces all items and texts for an existing news entry (full replace).
 */
router.put(
  '/:name',
  sValidator('param', newsParamSchema),
  sValidator('json', newsBodySchema),
  async (c) => {
    const { name } = c.req.valid('param')
    const body = c.req.valid('json')

    await db.transaction(async (tx) => {
      await tx.update(news).set({ startAt: body.startAt, endAt: body.endAt }).where(eq(news.name, name))
      await tx.delete(newsItemText).where(eq(newsItemText.newsName, name))
      await tx.delete(newsItems).where(eq(newsItems.newsName, name))
      await writeNewsItems(tx, name, body.items)
    })

    return c.json({ name })
  },
)

/**
 * DELETE /api/news/:name
 * Deletes a news entry and all associated items and texts.
 */
router.delete('/:name', sValidator('param', newsParamSchema), async (c) => {
  const { name } = c.req.valid('param')

  await db.transaction(async (tx) => {
    await tx.delete(newsItemText).where(eq(newsItemText.newsName, name))
    await tx.delete(newsItems).where(eq(newsItems.newsName, name))
    await tx.delete(news).where(eq(news.name, name))
  })

  return c.newResponse(null, 204)
})

export default router
