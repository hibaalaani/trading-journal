/**
 * Stats Overview Component
 * Shows comprehensive trading statistics
 */

import React from 'react'
import { PeriodStats } from '@/types/trade'
import { formatCurrency } from '@/lib/calculations'

interface StatsOverviewProps {
  stats: PeriodStats
  title: string
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, title }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-xl font-bold mb-6">{title}</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <div className="text-sm text-gray-400 mb-1">Total Trades</div>
          <div className="text-2xl font-bold">{stats.totalTrades}</div>
        </div>
        
        <div>
          <div className="text-sm text-gray-400 mb-1">Win Rate</div>
          <div className="text-2xl font-bold text-blue-400">
            {stats.winRate.toFixed(1)}%
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-400 mb-1">Net P/L</div>
          <div className={`text-2xl font-bold ${
            stats.totalNetPL >= 0 ? 'text-profit' : 'text-loss'
          }`}>
            {formatCurrency(stats.totalNetPL)}
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-400 mb-1">Total Commission</div>
          <div className="text-2xl font-bold text-orange-400">
            ${stats.totalCommission.toFixed(2)}
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-400 mb-1">Winning Trades</div>
          <div className="text-2xl font-bold text-profit">
            {stats.winningTrades}
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-400 mb-1">Losing Trades</div>
          <div className="text-2xl font-bold text-loss">
            {stats.losingTrades}
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-400 mb-1">Average Win</div>
          <div className="text-2xl font-bold text-profit">
            {formatCurrency(stats.averageWin)}
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-400 mb-1">Average Loss</div>
          <div className="text-2xl font-bold text-loss">
            {formatCurrency(-stats.averageLoss)}
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-400 mb-1">Risk/Reward Ratio</div>
          <div className="text-2xl font-bold">
            {stats.riskRewardRatio.toFixed(2)}
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-400 mb-1">Largest Win</div>
          <div className="text-2xl font-bold text-profit">
            {formatCurrency(stats.largestWin)}
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-400 mb-1">Largest Loss</div>
          <div className="text-2xl font-bold text-loss">
            {formatCurrency(stats.largestLoss)}
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-400 mb-1">Gross Profit</div>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.totalGrossProfit)}
          </div>
        </div>
      </div>
    </div>
  )
}
