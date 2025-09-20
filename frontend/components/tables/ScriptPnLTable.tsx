'use client';

import { formatCurrency, getPnLColorClass } from '@/utils/calculations';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

// Mock data - will be replaced with real API data
const mockScriptPnL = [
  {
    symbol: 'LUCK',
    totalPnL: 15000,
    totalQuantityTraded: 1200,
    totalInvested: 780000,
    totalRecovered: 795000,
    avgBuyRate: 650.00,
    avgSellRate: 680.00,
  },
  {
    symbol: 'TRG',
    totalPnL: 3200,
    totalQuantityTraded: 2000,
    totalInvested: 91000,
    totalRecovered: 94200,
    avgBuyRate: 45.50,
    avgSellRate: 47.10,
  },
  {
    symbol: 'OGDC',
    totalPnL: 1800,
    totalQuantityTraded: 1000,
    totalInvested: 82000,
    totalRecovered: 83800,
    avgBuyRate: 82.00,
    avgSellRate: 83.80,
  },
  {
    symbol: 'UBL',
    totalPnL: -1100,
    totalQuantityTraded: 300,
    totalInvested: 52650,
    totalRecovered: 51550,
    avgBuyRate: 175.50,
    avgSellRate: 171.83,
  },
  {
    symbol: 'PSO',
    totalPnL: 450,
    totalQuantityTraded: 500,
    totalInvested: 45000,
    totalRecovered: 45450,
    avgBuyRate: 90.00,
    avgSellRate: 90.90,
  },
];

export default function ScriptPnLTable() {
  const scriptPnL = mockScriptPnL;
  
  const totalPnL = scriptPnL.reduce((sum, script) => sum + script.totalPnL, 0);
  const totalInvested = scriptPnL.reduce((sum, script) => sum + script.totalInvested, 0);
  const totalRecovered = scriptPnL.reduce((sum, script) => sum + script.totalRecovered, 0);
  const profitableScripts = scriptPnL.filter(script => script.totalPnL > 0).length;
  const lossMakingScripts = scriptPnL.filter(script => script.totalPnL < 0).length;

  if (scriptPnL.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No script-wise P&L data found</p>
        <p className="text-sm text-gray-400 mt-1">Complete some sell transactions to see realized P&L by script</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{scriptPnL.length}</p>
          <p className="text-sm text-gray-600">Total Scripts</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{profitableScripts}</p>
          <p className="text-sm text-gray-600">Profitable</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{lossMakingScripts}</p>
          <p className="text-sm text-gray-600">Loss-making</p>
        </div>
        <div className="text-center">
          <p className={`text-2xl font-bold ${getPnLColorClass(totalPnL)}`}>
            {formatCurrency(totalPnL)}
          </p>
          <p className="text-sm text-gray-600">Total P&L</p>
        </div>
      </div>

      {/* Script P&L Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total P&L
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                P&L %
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity Traded
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Invested
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Recovered
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Buy Rate
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Sell Rate
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {scriptPnL.map((script) => {
              const pnlPercentage = (script.totalPnL / script.totalInvested) * 100;
              
              return (
                <tr key={script.symbol} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{script.symbol}</span>
                      {script.totalPnL >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600 ml-2" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 ml-2" />
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-medium font-mono ${getPnLColorClass(script.totalPnL)}`}>
                      {formatCurrency(script.totalPnL)}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-medium ${getPnLColorClass(script.totalPnL)}`}>
                      {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono">
                    {script.totalQuantityTraded.toLocaleString()}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono">
                    {formatCurrency(script.totalInvested)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono">
                    {formatCurrency(script.totalRecovered)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono">
                    {formatCurrency(script.avgBuyRate)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono">
                    {formatCurrency(script.avgSellRate)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Performance Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-blue-800">
              <strong>Best Performer:</strong> {scriptPnL.reduce((best, current) => 
                current.totalPnL > best.totalPnL ? current : best
              ).symbol} with {formatCurrency(Math.max(...scriptPnL.map(s => s.totalPnL)))} profit
            </p>
            <p className="text-blue-800">
              <strong>Worst Performer:</strong> {scriptPnL.reduce((worst, current) => 
                current.totalPnL < worst.totalPnL ? current : worst
              ).symbol} with {formatCurrency(Math.min(...scriptPnL.map(s => s.totalPnL)))} loss
            </p>
          </div>
          <div>
            <p className="text-blue-800">
              <strong>Total Investment:</strong> {formatCurrency(totalInvested)}
            </p>
            <p className="text-blue-800">
              <strong>Total Recovery:</strong> {formatCurrency(totalRecovered)}
            </p>
            <p className="text-blue-800">
              <strong>Win Rate:</strong> {((profitableScripts / scriptPnL.length) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
