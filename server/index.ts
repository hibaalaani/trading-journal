import cors from 'cors'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { db } from './db'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'

type TradeDirection = 'LONG' | 'SHORT'

function calculateTradeMetrics(
  direction: TradeDirection,
  entryPrice: number,
  exitPrice: number,
  positionSize: number,
  commission: number
) {
  const grossPL =
    direction === 'LONG'
      ? (exitPrice - entryPrice) * positionSize
      : (entryPrice - exitPrice) * positionSize

  const netPL = grossPL - commission

  const returnPercent =
    direction === 'LONG'
      ? ((exitPrice - entryPrice) / entryPrice) * 100
      : ((entryPrice - exitPrice) / entryPrice) * 100

  const isWin = netPL > 0

  return { grossPL, netPL, returnPercent, isWin }
}

const app = express()
app.use(cors())
app.use(express.json())

function asyncHandler(
  fn: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>
) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/trades', asyncHandler(async (_req, res) => {
  const trades = await db.trade.findMany({
    orderBy: { date: 'desc' },
  })
  res.json(trades)
}))

app.post('/api/trades', asyncHandler(async (req, res) => {
  const body = req.body ?? {}

  const direction = body.direction as TradeDirection
  if (direction !== 'LONG' && direction !== 'SHORT') {
    return res.status(400).json({ error: 'Invalid direction' })
  }

  const entryPrice = Number(body.entryPrice)
  const exitPrice = Number(body.exitPrice)
  const positionSize = Number(body.positionSize)
  const commission = Number(body.commission ?? 0)

  if (!Number.isFinite(entryPrice) || !Number.isFinite(exitPrice) || !Number.isFinite(positionSize) || !Number.isFinite(commission)) {
    return res.status(400).json({ error: 'Invalid numeric fields' })
  }

  const metrics = calculateTradeMetrics(direction, entryPrice, exitPrice, positionSize, commission)

  const trade = await db.trade.create({
    data: {
      date: new Date(body.date),
      asset: String(body.asset ?? ''),
      direction,
      entryPrice,
      exitPrice,
      positionSize,
      commission,
      notes: body.notes ? String(body.notes) : null,
      ...metrics,
    },
  })

  res.status(201).json(trade)
}))

app.put('/api/trades/:id', asyncHandler(async (req, res) => {
  const id = req.params.id
  const body = req.body ?? {}

  const direction = body.direction as TradeDirection
  if (direction !== 'LONG' && direction !== 'SHORT') {
    return res.status(400).json({ error: 'Invalid direction' })
  }

  const entryPrice = Number(body.entryPrice)
  const exitPrice = Number(body.exitPrice)
  const positionSize = Number(body.positionSize)
  const commission = Number(body.commission ?? 0)

  if (!Number.isFinite(entryPrice) || !Number.isFinite(exitPrice) || !Number.isFinite(positionSize) || !Number.isFinite(commission)) {
    return res.status(400).json({ error: 'Invalid numeric fields' })
  }

  const metrics = calculateTradeMetrics(direction, entryPrice, exitPrice, positionSize, commission)

  const trade = await db.trade.update({
    where: { id },
    data: {
      date: new Date(body.date),
      asset: String(body.asset ?? ''),
      direction,
      entryPrice,
      exitPrice,
      positionSize,
      commission,
      notes: body.notes ? String(body.notes) : null,
      ...metrics,
    },
  })

  res.json(trade)
}))

app.delete('/api/trades/:id', asyncHandler(async (req, res) => {
  const id = req.params.id
  await db.trade.delete({ where: { id } })
  res.status(204).end()
}))

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = err instanceof Error ? err.message : String(err)
  const code = err && typeof err === 'object' && 'code' in err ? String((err as { code: string }).code) : ''
  console.error('API error:', code || message, err)
  if (code.startsWith('P')) {
    console.error('Prisma error: ensure "npx prisma db push" ran in the build and the database path is writable (e.g. persistent disk on Render).')
  }
  res.status(500).json({ error: 'Internal server error' })
})

// In production, serve the built frontend and SPA fallback.
// Use process.cwd() so dist is found regardless of where the server module lives (e.g. Render).
if (isProduction) {
  const distPath = path.resolve(process.cwd(), 'dist')
  app.use(
    express.static(distPath, {
      index: false,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css; charset=utf-8')
        if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
      },
    })
  )
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

const port = Number(process.env.PORT ?? 3001)
app.listen(port, async () => {
  // eslint-disable-next-line no-console
  console.log(isProduction ? `App running on port ${port}` : `API listening on http://localhost:${port}`)
  if (isProduction) {
    try {
      await db.trade.count()
      // eslint-disable-next-line no-console
      console.log('Database connection OK')
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Database connection failed:', e)
      // eslint-disable-next-line no-console
      console.error('Ensure your build command includes: npx prisma db push')
      // eslint-disable-next-line no-console
      console.error('On Render: add a persistent Disk mounted at path "prisma" so the DB is writable.')
    }
  }
})

