/**
 * Trading Calculations Engine
 * All profit/loss and statistical calculations
 */

import { Trade, TradeDirection, PeriodStats, EquityPoint } from '@/types/trade'

/**
 * Calculate gross P&L (before commission)
 */
export function calculateGrossPL(
  direction: TradeDirection,
  entryPrice: number,
  exitPrice: number,
  positionSize: number
): number {
  if (direction === 'LONG') {
    return (exitPrice - entryPrice) * positionSize
  } else {
    return (entryPrice - exitPrice) * positionSize
  }
}

/**
 * Calculate net P&L (after commission)
 */
export function calculateNetPL(grossPL: number, commission: number): number {
  return grossPL - commission
}

/**
 * Calculate return percentage
 */
export function calculateReturnPercent(
  direction: TradeDirection,
  entryPrice: number,
  exitPrice: number
): number {
  if (direction === 'LONG') {
    return ((exitPrice - entryPrice) / entryPrice) * 100
  } else {
    return ((entryPrice - exitPrice) / entryPrice) * 100
  }
}

/**
 * Determine if trade is a winner
 */
export function isWinningTrade(netPL: number): boolean {
  return netPL > 0
}

/**
 * Calculate all trade metrics at once
 */
export function calculateTradeMetrics(
  direction: TradeDirection,
  entryPrice: number,
  exitPrice: number,
  positionSize: number,
  commission: number
) {
  const grossPL = calculateGrossPL(direction, entryPrice, exitPrice, positionSize)
  const netPL = calculateNetPL(grossPL, commission)
  const returnPercent = calculateReturnPercent(direction, entryPrice, exitPrice)
  const isWin = isWinningTrade(netPL)

  return {
    grossPL,
    netPL,
    returnPercent,
    isWin
  }
}

/**
 * Calculate statistics for a period (day/week/month)
 */
export function calculatePeriodStats(trades: Trade[]): PeriodStats {
  if (trades.length === 0) {
    return {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      totalGrossProfit: 0,
      totalCommission: 0,
      totalNetPL: 0,
      winRate: 0,
      averageWin: 0,
      averageLoss: 0,
      riskRewardRatio: 0,
      largestWin: 0,
      largestLoss: 0
    }
  }

  const winningTrades = trades.filter(t => t.isWin)
  const losingTrades = trades.filter(t => !t.isWin)

  const totalGrossProfit = trades.reduce((sum, t) => sum + t.grossPL, 0)
  const totalCommission = trades.reduce((sum, t) => sum + t.commission, 0)
  const totalNetPL = trades.reduce((sum, t) => sum + t.netPL, 0)

  const averageWin = winningTrades.length > 0
    ? winningTrades.reduce((sum, t) => sum + t.netPL, 0) / winningTrades.length
    : 0

  const averageLoss = losingTrades.length > 0
    ? Math.abs(losingTrades.reduce((sum, t) => sum + t.netPL, 0) / losingTrades.length)
    : 0

  const riskRewardRatio = averageLoss > 0 ? averageWin / averageLoss : 0

  const largestWin = winningTrades.length > 0
    ? Math.max(...winningTrades.map(t => t.netPL))
    : 0

  const largestLoss = losingTrades.length > 0
    ? Math.min(...losingTrades.map(t => t.netPL))
    : 0

  return {
    totalTrades: trades.length,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    totalGrossProfit,
    totalCommission,
    totalNetPL,
    winRate: (winningTrades.length / trades.length) * 100,
    averageWin,
    averageLoss,
    riskRewardRatio,
    largestWin,
    largestLoss
  }
}

/**
 * Calculate equity curve data points
 */
export function calculateEquityCurve(trades: Trade[], startingBalance: number = 2200): EquityPoint[] {
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const equityPoints: EquityPoint[] = [
    {
      date: sortedTrades[0]?.date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      equity: startingBalance
    }
  ]

  let runningEquity = startingBalance

  sortedTrades.forEach(trade => {
    runningEquity += trade.netPL
    equityPoints.push({
      date: trade.date.toISOString().split('T')[0],
      equity: runningEquity
    })
  })

  return equityPoints
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  const prefix = amount >= 0 ? '+' : ''
  return `${prefix}$${amount.toFixed(2)}`
}

/**
 * Format percentage for display
 */
export function formatPercent(percent: number): string {
  const prefix = percent >= 0 ? '+' : ''
  return `${prefix}${percent.toFixed(2)}%`
}
