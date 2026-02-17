/**
 * Trade Table Component
 * Displays all trades in a sortable table
 */

import React from 'react'
import { Trade } from '@/types/trade'
import { formatCurrency, formatPercent } from '@/lib/calculations'
import { Edit, Trash2 } from 'lucide-react'

interface TradeTableProps {
  trades: Trade[]
  onEdit: (trade: Trade) => void
  onDelete: (id: string) => void
}

export const TradeTable: React.FC<TradeTableProps> = ({ trades, onEdit, onDelete }) => {
  if (trades.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-gray-400 text-lg">No trades yet. Click "Add Trade" to get started.</p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Asset</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Direction</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Entry</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Exit</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Size</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Gross P/L</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Commission</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Net P/L</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Return %</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-b border-border hover:bg-background transition-colors">
                <td className="px-4 py-3 text-sm">
                  {new Date(trade.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm font-medium">{trade.asset}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded ${
                    trade.direction === 'LONG' 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {trade.direction}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right">${trade.entryPrice.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-right">${trade.exitPrice.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-right">{trade.positionSize}</td>
                <td className={`px-4 py-3 text-sm text-right font-medium ${
                  trade.grossPL >= 0 ? 'text-profit' : 'text-loss'
                }`}>
                  {formatCurrency(trade.grossPL)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-400">
                  ${trade.commission.toFixed(2)}
                </td>
                <td className={`px-4 py-3 text-sm text-right font-bold ${
                  trade.netPL >= 0 ? 'text-profit' : 'text-loss'
                }`}>
                  {formatCurrency(trade.netPL)}
                </td>
                <td className={`px-4 py-3 text-sm text-right ${
                  trade.returnPercent >= 0 ? 'text-profit' : 'text-loss'
                }`}>
                  {formatPercent(trade.returnPercent)}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(trade)}
                      className="p-1 hover:bg-background rounded transition-colors"
                      title="Edit trade"
                    >
                      <Edit size={16} className="text-blue-400" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this trade?')) {
                          onDelete(trade.id)
                        }
                      }}
                      className="p-1 hover:bg-background rounded transition-colors"
                      title="Delete trade"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
