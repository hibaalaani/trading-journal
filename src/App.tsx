/**
 * Main App Component
 * Trading Journal Application
 */

import { useState, useEffect } from 'react'
import { Trade, TradeFormData } from './types/trade'
import { StatCard } from './components/StatCard'
import { TradeForm } from './components/TradeForm'
import { TradeTable } from './components/TradeTable'
import { EquityCurveChart } from './components/EquityCurveChart'
import { StatsOverview } from './components/StatsOverview'
import { 
  getAllTrades, 
  getTradesThisWeek, 
  getTradesThisMonth,
  createTrade,
  updateTrade,
  deleteTrade
} from './lib/api'
import { calculatePeriodStats, calculateEquityCurve, formatCurrency } from './lib/calculations'
import { Plus, TrendingUp } from 'lucide-react'

type ViewMode = 'daily' | 'weekly' | 'monthly'

function App() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [weekTrades, setWeekTrades] = useState<Trade[]>([])
  const [monthTrades, setMonthTrades] = useState<Trade[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('monthly')
  const [showForm, setShowForm] = useState(false)
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null)
  const [loading, setLoading] = useState(true)

  // Load trades on mount
  useEffect(() => {
    loadTrades()
  }, [])

  const loadTrades = async () => {
    try {
      setLoading(true)
      const [all, week, month] = await Promise.all([
        getAllTrades(),
        getTradesThisWeek(),
        getTradesThisMonth()
      ])
      setTrades(all)
      setWeekTrades(week)
      setMonthTrades(month)
    } catch (error) {
      console.error('Failed to load trades:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTrade = async (data: TradeFormData) => {
    try {
      await createTrade(data)
      await loadTrades()
      setShowForm(false)
    } catch (error) {
      console.error('Failed to create trade:', error)
      alert('Failed to add trade. Please try again.')
    }
  }

  const handleUpdateTrade = async (data: TradeFormData) => {
    if (!editingTrade) return
    
    try {
      await updateTrade(editingTrade.id, data)
      await loadTrades()
      setEditingTrade(null)
      setShowForm(false)
    } catch (error) {
      console.error('Failed to update trade:', error)
      alert('Failed to update trade. Please try again.')
    }
  }

  const handleDeleteTrade = async (id: string) => {
    try {
      await deleteTrade(id)
      await loadTrades()
    } catch (error) {
      console.error('Failed to delete trade:', error)
      alert('Failed to delete trade. Please try again.')
    }
  }

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTrade(null)
  }

  // Calculate statistics
  const weekStats = calculatePeriodStats(weekTrades)
  const monthStats = calculatePeriodStats(monthTrades)
  const allTimeStats = calculatePeriodStats(trades)
  
  // Calculate equity curve
  const equityCurve = calculateEquityCurve(trades)

  // Get display trades based on view mode
  const displayTrades = viewMode === 'weekly' 
    ? weekTrades 
    : viewMode === 'monthly' 
    ? monthTrades 
    : trades

  const displayStats = viewMode === 'weekly'
    ? weekStats
    : viewMode === 'monthly'
    ? monthStats
    : allTimeStats

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <TrendingUp size={32} className="text-blue-500" />
              <h1 className="text-2xl font-bold">Trading Journal</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              Add Trade
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* View Mode Selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'weekly'
                ? 'bg-blue-600 text-white'
                : 'bg-card border border-border hover:bg-background'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-card border border-border hover:bg-background'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setViewMode('daily')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'daily'
                ? 'bg-blue-600 text-white'
                : 'bg-card border border-border hover:bg-background'
            }`}
          >
            All Time
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Net P/L"
            value={formatCurrency(displayStats.totalNetPL)}
            trend={displayStats.totalNetPL >= 0 ? 'up' : 'down'}
          />
          <StatCard
            label="Win Rate"
            value={`${displayStats.winRate.toFixed(1)}%`}
            subValue={`${displayStats.winningTrades}W / ${displayStats.losingTrades}L`}
            trend={displayStats.winRate >= 50 ? 'up' : 'down'}
          />
          <StatCard
            label="Total Trades"
            value={displayStats.totalTrades}
            trend="neutral"
          />
          <StatCard
            label="Total Commission"
            value={`$${displayStats.totalCommission.toFixed(2)}`}
            trend="neutral"
          />
        </div>

        {/* Trades Table */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            {viewMode === 'weekly' ? 'This Week\'s Trades' : 
             viewMode === 'monthly' ? 'This Month\'s Trades' : 
             'All Trades'}
          </h2>
          <TradeTable
            trades={displayTrades}
            onEdit={handleEdit}
            onDelete={handleDeleteTrade}
          />
        </div>

        {/* Equity Curve */}
        {trades.length > 0 && (
          <div className="mb-8">
            <EquityCurveChart data={equityCurve} />
          </div>
        )}

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {weekTrades.length > 0 && (
            <StatsOverview stats={weekStats} title="This Week's Performance" />
          )}
          {monthTrades.length > 0 && (
            <StatsOverview stats={monthStats} title="This Month's Performance" />
          )}
        </div>
      </main>

      {/* Trade Form Modal */}
      {showForm && (
        <TradeForm
          trade={editingTrade}
          onSubmit={editingTrade ? handleUpdateTrade : handleAddTrade}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  )
}

export default App
