/**
 * API Layer - Data Access Functions
 * Browser-safe API client that talks to the backend server.
 */

import { Trade, TradeFormData } from '@/types/trade'

// In dev, Vite proxies /api. In production, use same origin or set VITE_API_URL (e.g. for split deploy).
const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

function deserializeTrade(t: any): Trade {
  return {
    ...t,
    date: new Date(t.date),
    createdAt: new Date(t.createdAt),
    updatedAt: new Date(t.updatedAt),
  } as Trade
}

/**
 * Create a new trade
 */
export async function createTrade(data: TradeFormData): Promise<Trade> {
  const response = await fetch(`${API_BASE}/trades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create trade')
  return deserializeTrade(await response.json())
}

/**
 * Update an existing trade
 */
export async function updateTrade(id: string, data: TradeFormData): Promise<Trade> {
  const response = await fetch(`${API_BASE}/trades/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update trade')
  return deserializeTrade(await response.json())
}

/**
 * Delete a trade
 */
export async function deleteTrade(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/trades/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete trade')
}

/**
 * Get all trades
 */
export async function getAllTrades(): Promise<Trade[]> {
  const response = await fetch(`${API_BASE}/trades`)
  if (!response.ok) throw new Error('Failed to fetch trades')
  const trades = await response.json()
  return trades.map(deserializeTrade)
}

/**
 * Get trades for current week (client-side filter)
 */
export async function getTradesThisWeek(): Promise<Trade[]> {
  const now = new Date()
  const trades = await getAllTrades()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay())
  weekStart.setHours(0, 0, 0, 0)
  return trades.filter(t => t.date >= weekStart)
}

/**
 * Get trades for current month (client-side filter)
 */
export async function getTradesThisMonth(): Promise<Trade[]> {
  const trades = await getAllTrades()
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  return trades.filter(t => t.date >= monthStart)
}

/**
 * Get trades for current year (client-side filter)
 */
export async function getTradesThisYear(): Promise<Trade[]> {
  const trades = await getAllTrades()
  const now = new Date()
  const yearStart = new Date(now.getFullYear(), 0, 1)
  return trades.filter(t => t.date >= yearStart)
}

/**
 * Get trades within date range (client-side filter)
 */
export async function getTradesByDateRange(startDate: Date, endDate: Date): Promise<Trade[]> {
  const trades = await getAllTrades()
  return trades.filter(t => t.date >= startDate && t.date <= endDate)
}
