'use client';

import { formatCurrency, getPnLColorClass } from '@/utils/calculations';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Mock data - will be replaced with real API data
const mockHoldings = [
  {
    symbol: 'TRG',
    quantity: 1500,
    avgCost: 46.25,
    totalInvested: 69375,
    currentValue: 72000,
    unrealizedPnL: 2625,
  },
  {
    symbol: 'LUCK',
    quantity: 500,
    avgCost: 650.00,
    totalInvested: 325000,
    currentValue: 335000,
    unrealizedPnL: 10000,
  },
  {
    symbol: 'UBL',
    quantity: 200,
    avgCost: 175.50,
    totalInvested: 35100,
    currentValue: 34000,
    unrealizedPnL: -1100,
  },
];

export default function CurrentHoldingsTable() {
  const holdings = mockHoldings;

  if (holdings.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No current holdings</p>
        <p className="text-sm text-gray-400 mt-1">Add some buy transactions to see your holdings</p>
      </div>
    );
  }

  const totalInvested = holdings.reduce((sum, holding) => sum + holding.totalInvested, 0);
  const totalCurrentValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
  const totalUnrealizedPnL = totalCurrentValue - totalInvested;

  return (
    <div className="space-y-4">
      {/* Summary Row */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Total Invested</p>
            <p className="font-semibold text-gray-900">{formatCurrency(totalInvested)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Current Value</p>
            <p className="font-semibold text-gray-900">{formatCurrency(totalCurrentValue)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Unrealized P&L</p>
            <p className={`font-semibold ${getPnLColorClass(totalUnrealizedPnL)}`}>
              {formatCurrency(totalUnrealizedPnL)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">P&L %</p>
            <p className={`font-semibold ${getPnLColorClass(totalUnrealizedPnL)}`}>
              {((totalUnrealizedPnL / totalInvested) * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Cost
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Invested
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Value
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unrealized P&L
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                P&L %
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {holdings.map((holding) => {
              const pnlPercentage = (holding.unrealizedPnL / holding.totalInvested) * 100;
              
              return (
                <tr key={holding.symbol} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{holding.symbol}</span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono">
                    {holding.quantity.toLocaleString()}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono">
                    {formatCurrency(holding.avgCost)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono">
                    {formatCurrency(holding.totalInvested)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono">
                    {formatCurrency(holding.currentValue)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {holding.unrealizedPnL >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium font-mono ${getPnLColorClass(holding.unrealizedPnL)}`}>
                        {formatCurrency(holding.unrealizedPnL)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-medium ${getPnLColorClass(holding.unrealizedPnL)}`}>
                      {pnlPercentage.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
