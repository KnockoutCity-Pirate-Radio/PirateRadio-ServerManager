import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/bun'
import crewsRouter from './routes/api/crews'
import maintenanceRouter from './routes/api/maintenance'
import newsRouter from './routes/api/news'
import statsRouter from './routes/api/stats'
import tunablesRouter from './routes/api/tunables'
import usersRouter from './routes/api/users'

const app = new Hono()

app.use(logger())

app.route('/api/crews', crewsRouter)
app.route('/api/stats', statsRouter)
app.route('/api/users', usersRouter)
app.route('/api/tunables', tunablesRouter)
app.route('/api/news', newsRouter)
app.route('/api/maintenance', maintenanceRouter)

if (process.env.NODE_ENV === 'production') {
  app.use('/*', serveStatic({ root: './dist' }))
  app.get('/*', serveStatic({ path: './dist/index.html' }))
}

export default {
  port: 3001,
  fetch: app.fetch,
}
