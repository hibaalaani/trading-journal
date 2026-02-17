/**
 * Trade Form Component
 * Handles creation and editing of trades
 */

import React, { useState, useEffect } from 'react'
import { TradeFormData, Trade } from '@/types/trade'
import { X } from 'lucide-react'

interface TradeFormProps {
  trade?: Trade | null
  onSubmit: (data: TradeFormData) => void
  onCancel: () => void
}

export const TradeForm: React.FC<TradeFormProps> = ({ trade, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<TradeFormData>({
    date: new Date().toISOString().split('T')[0],
    asset: '',
    direction: 'LONG',
    entryPrice: '',
    exitPrice: '',
    positionSize: '',
    commission: '0',
    notes: ''
  })

  useEffect(() => {
    if (trade) {
      setFormData({
        date: trade.date.toISOString().split('T')[0],
        asset: trade.asset,
        direction: trade.direction,
        entryPrice: trade.entryPrice.toString(),
        exitPrice: trade.exitPrice.toString(),
        positionSize: trade.positionSize.toString(),
        commission: trade.commission.toString(),
        notes: trade.notes || ''
      })
    }
  }, [trade])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {trade ? 'Edit Trade' : 'Add New Trade'}
          </h2>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full bg-background border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Asset</label>
              <input
                type="text"
                name="asset"
                value={formData.asset}
                onChange={handleChange}
                placeholder="e.g., AAPL, BTC/USD"
                required
                className="w-full bg-background border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Direction</label>
            <select
              name="direction"
              value={formData.direction}
              onChange={handleChange}
              className="w-full bg-background border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LONG">LONG</option>
              <option value="SHORT">SHORT</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Entry Price</label>
              <input
                type="number"
                name="entryPrice"
                value={formData.entryPrice}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
                required
                className="w-full bg-background border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Exit Price</label>
              <input
                type="number"
                name="exitPrice"
                value={formData.exitPrice}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
                required
                className="w-full bg-background border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Position Size</label>
              <input
                type="number"
                name="positionSize"
                value={formData.positionSize}
                onChange={handleChange}
                step="0.01"
                placeholder="0"
                required
                className="w-full bg-background border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Commission</label>
            <input
              type="number"
              name="commission"
              value={formData.commission}
              onChange={handleChange}
              step="0.01"
              placeholder="0.00"
              required
              className="w-full bg-background border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Trade notes, strategy, learnings..."
              className="w-full bg-background border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-border rounded hover:bg-background transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors"
            >
              {trade ? 'Update Trade' : 'Add Trade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
