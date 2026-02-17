/**
 * Type Definitions for Trading Journal
 */

export type TradeDirection = 'LONG' | 'SHORT'

export interface Trade {
  id: string
  createdAt: Date
  updatedAt: Date
  date: Date
  asset: string
  direction: TradeDirection
  entryPrice: number
  exitPrice: number
  positionSize: number
  commission: number
  notes?: string | null
  grossPL: number
  netPL: number
  returnPercent: number
  isWin: boolean
}

export interface TradeFormData {
  date: string
  asset: string
  direction: TradeDirection
  entryPrice: string
  exitPrice: string
  positionSize: string
  commission: string
  notes: string
}

export interface DailyStats {
  date: string
  totalTrades: number
  winningTrades: number
  losingTrades: number
  grossProfit: number
  totalCommission: number
  netPL: number
  winRate: number
}

export interface PeriodStats {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  totalGrossProfit: number
  totalCommission: number
  totalNetPL: number
  winRate: number
  averageWin: number
  averageLoss: number
  riskRewardRatio: number
  largestWin: number
  largestLoss: number
}

export interface EquityPoint {
  date: string
  equity: number
}
