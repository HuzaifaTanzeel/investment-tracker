'use client';

import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, getPnLColorClass } from '@/utils/calculations';

// Mock data - will be replaced with real API data
const mockMonthlyData = {
  currentMonth: {
    month: 'December',
    year: 2024,
    pnl: 8500,
    transactions: 12,
  },
  lastMonth: {
    month: 'November', 
    year: 2024,
    pnl: 6200,
    transactions: 8,
  },
};

export default function MonthlyPnLCard() {
  const { currentMonth, lastMonth } = mockMonthlyData;
  const changeFromLastMonth = currentMonth.pnl - lastMonth.pnl;
  const changePercentage = lastMonth.pnl !== 0 
    ? (changeFromLastMonth / Math.abs(lastMonth.pnl)) * 100 
    : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Monthly P&L</h3>
        <Calendar className="w-5 h-5 text-blue-600" />
      </div>

      <div className="space-y-4">
        {/* Current Month */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              {currentMonth.month} {currentMonth.year}
            </span>
            <span className="text-xs text-gray-500">
              {currentMonth.transactions} transactions
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {currentMonth.pnl >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
            <span className={`text-2xl font-bold ${getPnLColorClass(currentMonth.pnl)}`}>
              {formatCurrency(currentMonth.pnl)}
            </span>
          </div>
        </div>

        {/* Comparison with Last Month */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">vs {lastMonth.month}:</span>
            <div className="flex items-center space-x-1">
              {changeFromLastMonth >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-600" />
              )}
              <span className={getPnLColorClass(changeFromLastMonth)}>
                {formatCurrency(Math.abs(changeFromLastMonth))}
              </span>
              {changePercentage !== 0 && (
                <span className={`text-xs ${getPnLColorClass(changeFromLastMonth)}`}>
                  ({Math.abs(changePercentage).toFixed(1)}%)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Last Month Reference */}
        <div className="text-xs text-gray-500">
          {lastMonth.month}: {formatCurrency(lastMonth.pnl)} ({lastMonth.transactions} trades)
        </div>
      </div>
    </div>
  );
}
