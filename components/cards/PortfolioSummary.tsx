'use client';

import { formatCurrency, getPnLColorClass } from '@/utils/calculations';
import { PieChart, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

// Mock data - will be replaced with real API data
const mockPortfolioSummary = {
  totalInvested: 429475,
  currentValue: 441000,
  unrealizedPnL: 11525,
  realizedPnL: 25000,
  totalHoldings: 3,
  totalShares: 2200,
  bestPerformer: 'LUCK',
  worstPerformer: 'UBL',
};

export default function PortfolioSummary() {
  const summary = mockPortfolioSummary;
  const totalPnLPercentage = (summary.unrealizedPnL / summary.totalInvested) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Portfolio Value */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Portfolio Value</h3>
          <PieChart className="w-5 h-5 text-blue-600" />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Invested:</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(summary.totalInvested)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Current Value:</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(summary.currentValue)}
            </span>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Unrealized P&L:</span>
              <div className="text-right">
                <div className={`text-lg font-bold ${getPnLColorClass(summary.unrealizedPnL)}`}>
                  {formatCurrency(summary.unrealizedPnL)}
                </div>
                <div className={`text-sm ${getPnLColorClass(summary.unrealizedPnL)}`}>
                  {totalPnLPercentage >= 0 ? '+' : ''}{totalPnLPercentage.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
          <DollarSign className="w-5 h-5 text-green-600" />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Realized P&L:</span>
            <span className={`font-semibold ${getPnLColorClass(summary.realizedPnL)}`}>
              {formatCurrency(summary.realizedPnL)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Best Performer:</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-600">{summary.bestPerformer}</span>
            </div>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Worst Performer:</span>
            <div className="flex items-center space-x-1">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="font-semibold text-red-600">{summary.worstPerformer}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Portfolio Stats</h3>
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Holdings:</span>
            <span className="font-semibold text-gray-900">{summary.totalHoldings} scripts</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Total Shares:</span>
            <span className="font-semibold text-gray-900">
              {summary.totalShares.toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Avg Investment:</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(summary.totalInvested / summary.totalHoldings)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
