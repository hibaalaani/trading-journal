/**
 * Express Backend API for Trading Journal
 * Handles database operations
 */

import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { calculateTradeMetrics } from './src/lib/calculations.js'

const app = express()
const prisma = new PrismaClient()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Get all trades
app.get('/api/trades', async (req, res) => {
  try {
    const trades = await prisma.trade.findMany({
      orderBy: { date: 'desc' }
    })
    res.json(trades)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create trade
app.post('/api/trades', async (req, res) => {
  try {
    const { date, asset, direction, entryPrice, exitPrice, positionSize, commission, notes } = req.body
    
    const metrics = calculateTradeMetrics(
      direction,
      parseFloat(entryPrice),
      parseFloat(exitPrice),
      parseFloat(positionSize),
      parseFloat(commission)
    )

    const trade = await prisma.trade.create({
      data: {
        date: new Date(date),
        asset,
        direction,
        entryPrice: parseFloat(entryPrice),
        exitPrice: parseFloat(exitPrice),
        positionSize: parseFloat(positionSize),
        commission: parseFloat(commission),
        notes: notes || null,
        ...metrics
      }
    })
    
    res.json(trade)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update trade
app.put('/api/trades/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { date, asset, direction, entryPrice, exitPrice, positionSize, commission, notes } = req.body
    
    const metrics = calculateTradeMetrics(
      direction,
      parseFloat(entryPrice),
      parseFloat(exitPrice),
      parseFloat(positionSize),
      parseFloat(commission)
    )

    const trade = await prisma.trade.update({
      where: { id },
      data: {
        date: new Date(date),
        asset,
        direction,
        entryPrice: parseFloat(entryPrice),
        exitPrice: parseFloat(exitPrice),
        positionSize: parseFloat(positionSize),
        commission: parseFloat(commission),
        notes: notes || null,
        ...metrics
      }
    })
    
    res.json(trade)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete trade
app.delete('/api/trades/:id', async (req, res) => {
  try {
    const { id } = req.params
    await prisma.trade.delete({ where: { id } })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`✅ Trading Journal API running on http://localhost:${PORT}`)
})
