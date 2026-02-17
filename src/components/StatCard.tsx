/**
 * Stat Card Component
 * Displays key metrics in a card format
 */

import React from 'react'

interface StatCardProps {
  label: string
  value: string | number
  subValue?: string
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  subValue, 
  trend = 'neutral',
  className = ''
}) => {
  const trendColor = trend === 'up' 
    ? 'text-profit' 
    : trend === 'down' 
    ? 'text-loss' 
    : 'text-gray-400'

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="text-sm text-gray-400 mb-2">{label}</div>
      <div className={`text-3xl font-bold ${trendColor}`}>
        {value}
      </div>
      {subValue && (
        <div className="text-sm text-gray-500 mt-1">{subValue}</div>
      )}
    </div>
  )
}
