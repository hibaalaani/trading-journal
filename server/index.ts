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

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/trades', async (_req, res) => {
  const trades = await db.trade.findMany({
    orderBy: { date: 'desc' },
  })
  res.json(trades)
})

app.post('/api/trades', async (req, res) => {
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
})

app.put('/api/trades/:id', async (req, res) => {
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
})

app.delete('/api/trades/:id', async (req, res) => {
  const id = req.params.id
  await db.trade.delete({ where: { id } })
  res.status(204).end()
})

// In production, serve the built frontend and SPA fallback
if (isProduction) {
  const distPath = path.join(__dirname, '..', 'dist')
  app.use(express.static(distPath))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

const port = Number(process.env.PORT ?? 3001)
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(isProduction ? `App running on port ${port}` : `API listening on http://localhost:${port}`)
})

