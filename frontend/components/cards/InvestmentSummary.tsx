'use client';

import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatCurrency, formatPercentage, getPnLColorClass } from '@/utils/calculations';

// Mock data - will be replaced with real API data
const mockSummary = {
  totalInvested: 250000,
  totalRecovered: 180000,
  realizedPnL: 25000,
  unrealizedPnL: 15000,
  currentMonthPnL: 8500,
  totalCharges: 3200,
};

export default function InvestmentSummary() {
  const summary = mockSummary;
  const totalPnL = summary.realizedPnL + summary.unrealizedPnL;
  const totalPnLPercentage = summary.totalInvested > 0 
    ? (totalPnL / summary.totalInvested) * 100 
    : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Investment Summary</h3>
        <Wallet className="w-5 h-5 text-blue-600" />
      </div>

      <div className="space-y-4">
        {/* Total Invested */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Invested:</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(summary.totalInvested)}
          </span>
        </div>

        {/* Total Recovered */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Recovered:</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(summary.totalRecovered)}
          </span>
        </div>

        {/* Realized P&L */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Realized P&L:</span>
          <div className="flex items-center space-x-1">
            {summary.realizedPnL >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <span className={`font-semibold ${getPnLColorClass(summary.realizedPnL)}`}>
              {formatCurrency(summary.realizedPnL)}
            </span>
          </div>
        </div>

        {/* Unrealized P&L */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Unrealized P&L:</span>
          <div className="flex items-center space-x-1">
            {summary.unrealizedPnL >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <span className={`font-semibold ${getPnLColorClass(summary.unrealizedPnL)}`}>
              {formatCurrency(summary.unrealizedPnL)}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-4">
          {/* Total P&L */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-900">Total P&L:</span>
            <div className="text-right">
              <div className={`text-lg font-bold ${getPnLColorClass(totalPnL)}`}>
                {formatCurrency(totalPnL)}
              </div>
              <div className={`text-sm ${getPnLColorClass(totalPnL)}`}>
                {formatPercentage(totalPnLPercentage)}
              </div>
            </div>
          </div>
        </div>

        {/* Total Charges */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Total Charges Paid:</span>
          <span className="text-gray-600">{formatCurrency(summary.totalCharges)}</span>
        </div>
      </div>
    </div>
  );
}
